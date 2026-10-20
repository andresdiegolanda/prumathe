"""Live viewer of the course: http://127.0.0.1:18091, started with docker compose up -d --wait visor.

Every half second it reads two planes: Docker, through the socket (docker_watch.py), and the
Kubernetes cluster of lesson 13, through the kind network (kube_watch.py). It serves the result as
JSON at /api/state; the page asks with ?v=N and, when nothing changed, gets only the version. It
answers GET and HEAD to its own host and nothing else, and it only reads: no request it makes to
Docker or Kubernetes changes anything.
"""
import json
import os
import signal
import sys
import threading
import time
import urllib.parse
from collections import deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import docker_watch
import kube_watch

PORT = int(os.environ.get('VISOR_PORT', '18091'))
EVERY_S = 0.5
MAX_EVENTS = 80
STATIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
TYPES = {'index.html': 'text/html; charset=utf-8', 'visor.css': 'text/css; charset=utf-8', 'visor.js': 'text/javascript; charset=utf-8', 'favicon.svg': 'image/svg+xml'}
CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
HOSTS = {'127.0.0.1:%d' % PORT, 'localhost:%d' % PORT}

events = deque(maxlen=MAX_EVENTS)
seq = 0
lock = threading.Lock()
state_json = b'{"version":0,"ok":false,"readAt":0}'
head_json = state_json
version = 0


def emit(plane, code, **params):
    global seq
    with lock:
        seq += 1
        events.appendleft(dict(seq=seq, at=int(time.time() * 1000), plane=plane, code=code, **params))


def safe(obj):
    """JSON a page can hold without surprises: ASCII only, and no <, > or & that could close a tag."""
    text = json.dumps(obj, ensure_ascii=True, separators=(',', ':'))
    return text.replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026').encode('ascii')


def loop():
    global state_json, head_json, version
    docker = docker_watch.DockerWatch(emit) if docker_watch.socket_problem() is None else None
    kube = kube_watch.KubeWatch(emit)
    planes = {'docker': {'ok': False, 'reason': 'starting', 'since': None, 'data': None}, 'k8s': {'ok': False, 'reason': 'starting', 'since': None, 'data': None}}
    last = None
    while True:
        started = time.time()
        now_ms = int(started * 1000)
        # Docker
        p = planes['docker']
        try:
            if docker is None:
                problem = docker_watch.socket_problem()
                if problem is None:
                    docker = docker_watch.DockerWatch(emit)
                else:
                    raise docker_watch.DockerError(problem)
            p['data'] = docker.read(started)
            p.update(ok=True, reason=None, since=None, readAt=now_ms)
        except Exception as e:  # keep the last good reading and say since when it is old
            reason = docker_watch.socket_problem() or ('error' if not isinstance(e, docker_watch.DockerError) else str(e))
            if p['ok'] or p['since'] is None:
                p['since'] = now_ms
            p.update(ok=False, reason=reason)
        # Kubernetes
        p = planes['k8s']
        on_kind = ('kind' in planes['docker']['data']['visorNetworks']) if planes['docker']['ok'] else None
        try:
            p['data'] = kube.read(started, on_kind)
            p.update(ok=True, reason=None, detail=None, since=None, readAt=now_ms)
        except kube_watch.KubeProblem as e:
            if p['ok'] or p['since'] is None:
                p['since'] = now_ms
            p.update(ok=False, reason=e.reason, detail=e.detail)
        except Exception as e:
            kube.close()
            if p['ok'] or p['since'] is None:
                p['since'] = now_ms
            p.update(ok=False, reason='error', detail=type(e).__name__)
        with lock:
            body = {'docker': {k: v for k, v in planes['docker'].items() if k != 'readAt'}, 'k8s': {k: v for k, v in planes['k8s'].items() if k != 'readAt'}, 'events': list(events)}
        content = json.dumps(body, sort_keys=True)
        if content != last:
            last = content
            version += 1
        full = dict(body, version=version, ok=planes['docker']['ok'] or planes['k8s']['ok'], readAt=now_ms, port=PORT)
        full['docker']['readAt'] = planes['docker'].get('readAt')
        full['k8s']['readAt'] = planes['k8s'].get('readAt')
        brief = {'version': version, 'same': True, 'ok': full['ok'], 'readAt': now_ms, 'docker': {k: planes['docker'].get(k) for k in ('ok', 'reason', 'since', 'readAt')}, 'k8s': {k: planes['k8s'].get(k) for k in ('ok', 'reason', 'since', 'readAt')}}
        state_json, head_json = safe(full), safe(brief)
        time.sleep(max(0.0, EVERY_S - (time.time() - started)))


class Handler(BaseHTTPRequestHandler):
    server_version = 'visor'
    sys_version = ''

    def log_message(self, *args):
        pass

    def handle_one_request(self):
        try:
            self.raw_requestline = self.rfile.readline(65537)
            if len(self.raw_requestline) > 65536:
                self.send_error(414)
                return
            if not self.raw_requestline:
                self.close_connection = True
                return
            if not self.parse_request():
                return
            if self.command in ('GET', 'HEAD'):
                self.serve()
            else:
                self.reply(405, 'text/plain; charset=utf-8', b'Read only / Solo lectura')
            self.wfile.flush()
        except TimeoutError:
            self.close_connection = True

    def reply(self, status, ctype, body):
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('Content-Security-Policy', CSP)
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)

    def serve(self):
        if (self.headers.get('Host') or '').lower() not in HOSTS:
            return self.reply(403, 'text/plain; charset=utf-8', b'Forbidden host / Host no permitido')
        url = urllib.parse.urlsplit(self.path)
        if url.path == '/api/state':
            asked = urllib.parse.parse_qs(url.query).get('v', [''])[0]
            body = head_json if asked == str(version) else state_json
            return self.reply(200, 'application/json; charset=utf-8', body)
        name = 'index.html' if url.path == '/' else url.path.lstrip('/')
        if name not in TYPES:
            return self.reply(404, 'text/plain; charset=utf-8', b'Not found / No encontrado')
        with open(os.path.join(STATIC, name), 'rb') as f:
            return self.reply(200, TYPES[name], f.read())


def main():
    signal.signal(signal.SIGTERM, lambda signum, frame: sys.exit(0))
    threading.Thread(target=loop, name='visor-read', daemon=True).start()
    server = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    server.daemon_threads = True
    print('VISOR http://127.0.0.1:%d  (docker compose stop visor)' % PORT, flush=True)
    server.serve_forever()


if __name__ == '__main__':
    main()
