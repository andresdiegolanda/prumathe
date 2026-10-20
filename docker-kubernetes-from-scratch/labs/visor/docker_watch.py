"""The Docker plane of the live viewer: what the course created on this Docker Engine.

It talks to the Engine API through the mounted socket with GET requests only, to a closed list of
paths. The events stream runs in its own thread; that is how containers that live less than half a
second (docker run --rm) still reach the log. The socket would allow anything: what keeps the viewer
read-only is this module, and the visor suite checks it.
"""
import http.client
import json
import os
import re
import socket
import threading
import time
import urllib.parse

SOCKET = '/var/run/docker.sock'
PROJECT = 'prumathe-dk'
CLUSTER = 'prumathe-dk'
APP_IMAGE = 'prumathe-signal'
NETWORKS = ('prumathe-dk_default', 'kind')
ENV_KEYS = ('MESSAGE', 'APP_VERSION')
READ_PATHS = ('/containers/json', '/containers/', '/images/json', '/images/', '/volumes', '/networks/', '/events')
HOLD_S = 2.0  # what a container did in its first seconds waits here, in case it is removed at once
EPHEMERAL_S = 10.0  # created and removed within this window: one line in the log


class DockerError(Exception):
    pass


class _Unix(http.client.HTTPConnection):
    def __init__(self, timeout):
        super().__init__('docker', timeout=timeout)

    def connect(self):
        sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        sock.settimeout(self.timeout)
        sock.connect(SOCKET)
        self.sock = sock


def _get(path, timeout=5, raw=False):
    if not path.startswith(READ_PATHS):
        raise DockerError('not a read path: ' + path)
    conn = _Unix(timeout)
    try:
        conn.request('GET', path)
        res = conn.getresponse()
        body = res.read()
    finally:
        conn.close()
    if res.status != 200:
        raise DockerError('HTTP %d on %s' % (res.status, path.split('?')[0]))
    return body if raw else json.loads(body or b'null')


def _q(**params):
    return '?' + urllib.parse.urlencode({k: (json.dumps(v) if isinstance(v, dict) else v) for k, v in params.items()})


def _short(image_id):
    return (image_id or '').replace('sha256:', '')[:12]


def _log_lines(raw):
    """Logs of a container without a TTY come in frames: 8 bytes of header, then the text."""
    out, at = [], 0
    while at + 8 <= len(raw) and raw[at] in (1, 2):
        size = int.from_bytes(raw[at + 4:at + 8], 'big')
        out.append(raw[at + 8:at + 8 + size].decode('utf-8', 'replace'))
        at += 8 + size
    text = ''.join(out) if out else raw.decode('utf-8', 'replace')
    return [line for line in text.splitlines() if line.strip()][-5:]


def pinned_base():
    """The base image the course pins, read from the application Dockerfile."""
    try:
        with open('/course/app/Dockerfile', encoding='utf-8') as f:
            m = re.search(r'^FROM (\S+)', f.read(), re.M)
            return m.group(1) if m else None
    except OSError:
        return None


def socket_problem():
    """Why the socket cannot be used, as a code the page explains; None if it can."""
    if not os.path.exists(SOCKET):
        return 'no-socket'
    try:
        sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        sock.settimeout(2)
        sock.connect(SOCKET)
        sock.close()
        return None
    except PermissionError:
        return 'socket-denied'
    except OSError:
        return 'socket-down'


class DockerWatch:
    def __init__(self, emit):
        self.emit = emit
        self.self_id = socket.gethostname()
        self.raw = []  # events from the stream, consumed by read()
        self.lock = threading.Lock()
        self.layers = {}  # image id -> layers with content
        self.health_cmd = {}  # container id -> its health check command, to leave its execs out
        self.execs = {}  # exec id -> (container name, command)
        self.held = {}  # container id -> {'at', 'name', 'image', 'events', 'exit'}
        self.names = {}  # container id -> name
        self.logs_at = 0
        self.logs = []
        self.base = pinned_base()
        threading.Thread(target=self._stream, name='docker-events', daemon=True).start()

    # ------------------------------------------------------------- events stream

    def _stream(self):
        filters = {'type': ['container', 'image', 'volume', 'network']}
        while True:
            try:
                conn = _Unix(None)
                conn.request('GET', '/events' + _q(since=int(time.time()), filters=filters))
                res = conn.getresponse()
                buf = b''
                while True:
                    chunk = res.read1(65536)
                    if not chunk:
                        break
                    buf += chunk
                    while b'\n' in buf:
                        line, buf = buf.split(b'\n', 1)
                        if line.strip():
                            with self.lock:
                                self.raw.append(json.loads(line))
            except Exception:
                pass
            time.sleep(1)

    def _course(self, attrs):
        return (
            attrs.get('com.docker.compose.project') == PROJECT
            or attrs.get('io.x-k8s.kind.cluster') == CLUSTER
            or attrs.get('image', '').startswith(APP_IMAGE)
        ) and attrs.get('com.docker.compose.service') != 'visor'

    def _hold(self, cid, now, code, params):
        h = self.held.setdefault(cid, {'at': now, 'name': params.get('container'), 'image': '', 'events': [], 'exit': None, 'created': False})
        h['events'].append((code, params))

    def _consume(self, now):
        with self.lock:
            raw, self.raw = self.raw, []
        for ev in raw:
            kind, action = ev.get('Type'), ev.get('Action', '')
            actor = ev.get('Actor') or {}
            attrs = actor.get('Attributes') or {}
            cid = actor.get('ID', '')
            if kind == 'container':
                if cid.startswith(self.self_id) or not self._course(attrs):
                    continue
                name = attrs.get('name', cid[:12])
                self.names[cid] = name
                if action.startswith('exec_create: '):
                    cmd = action[len('exec_create: '):]
                    if cmd != self.health_cmd.get(cid):
                        self.execs[attrs.get('execID', '')] = (name, cmd)
                elif action == 'exec_die':
                    found = self.execs.pop(attrs.get('execID', ''), None)
                    if found:
                        self.emit('docker', 'exec', container=found[0], cmd=found[1], exit=int(attrs.get('exitCode', 0)))
                elif action.startswith('health_status: '):
                    self.emit('docker', 'health', container=name, to=action.split(': ', 1)[1])
                elif action == 'create':
                    self.held[cid] = {'at': now, 'name': name, 'image': attrs.get('image', ''), 'events': [], 'exit': None, 'created': True}
                    self._hold(cid, now, 'created', {'container': name, 'image': attrs.get('image', '')})
                elif action == 'start':
                    self._hold(cid, now, 'started', {'container': name})
                elif action == 'die':
                    code = int(attrs.get('exitCode', 0))
                    self._hold(cid, now, 'exited', {'container': name, 'exit': code})
                    self.held[cid]['exit'] = code
                elif action == 'destroy':
                    h = self.held.pop(cid, None)
                    if h and h['created'] and now - h['at'] <= EPHEMERAL_S:
                        self.emit('docker', 'ephemeral', container=h['name'], image=h['image'], exit=h['exit'])
                    else:
                        for code, params in (h or {}).get('events', []):
                            self.emit('docker', code, **params)
                        self.emit('docker', 'removed', container=name)
                elif action in ('restart', 'oom'):
                    self._hold(cid, now, action, {'container': name})
            elif kind == 'image':
                name = attrs.get('name', '')
                if (name.startswith(APP_IMAGE) or name.startswith('python') or name.startswith('kindest/node')) and action in ('tag', 'untag', 'delete', 'pull'):
                    self.emit('docker', 'image' + action.capitalize(), image=name, id=_short(cid))
            elif kind == 'volume':
                if attrs.get('com.docker.compose.project') == PROJECT or cid.startswith(PROJECT):
                    if action in ('create', 'destroy'):
                        self.emit('docker', 'volume' + action.capitalize(), volume=cid)
            elif kind == 'network':
                net = attrs.get('name', '')
                if net in NETWORKS and action in ('connect', 'disconnect'):
                    who = attrs.get('container', '')
                    mine = who.startswith(self.self_id)
                    if mine or who in self.names:  # the viewer itself or a course container, not a previous viewer
                        self.emit('docker', 'network' + action.capitalize(), network=net, container=None if mine else self.names[who], visor=mine)
        # What stayed longer than HOLD_S without being removed is an ordinary change.
        for cid in list(self.held):
            h = self.held[cid]
            if now - h['at'] > HOLD_S:
                for code, params in h['events']:
                    self.emit('docker', code, **params)
                h['events'] = []
                if now - h['at'] > EPHEMERAL_S:
                    del self.held[cid]

    # ------------------------------------------------------------- one reading

    def read(self, now):
        listed = _get('/containers/json' + _q(all=1))
        me = next((c for c in listed if c['Id'].startswith(self.self_id)), None)
        course, hidden = [], 0
        for c in listed:
            if c is me:
                continue
            labels = c.get('Labels') or {}
            if labels.get('com.docker.compose.project') == PROJECT and labels.get('com.docker.compose.service') == 'visor':
                continue
            if labels.get('com.docker.compose.project') == PROJECT or labels.get('io.x-k8s.kind.cluster') == CLUSTER or c.get('Image', '').startswith(APP_IMAGE):
                course.append(c)
            else:
                hidden += 1
        for c in course:
            self.names[c['Id']] = (c.get('Names') or ['/' + c['Id'][:12]])[0].lstrip('/')
        containers = []
        for c in course:
            labels = c.get('Labels') or {}
            # The cluster nodes need only what the list already says; inspecting them can be slow.
            d = {'State': {'Status': c.get('State'), 'Running': c.get('State') == 'running'}} if labels.get('io.x-k8s.kind.cluster') == CLUSTER else _get('/containers/%s/json' % c['Id'])
            state = d.get('State') or {}
            config = d.get('Config') or {}
            health = state.get('Health')
            test = (config.get('Healthcheck') or {}).get('Test') or []
            if test and test[0] in ('CMD', 'CMD-SHELL'):
                self.health_cmd[c['Id']] = ' '.join(test[1:])
            env = dict(x.split('=', 1) for x in config.get('Env') or [] if '=' in x)
            host = d.get('HostConfig') or {}
            log = (health or {}).get('Log') or []
            containers.append({
                'id': c['Id'][:12],
                'name': (c.get('Names') or ['/' + c['Id'][:12]])[0].lstrip('/'),
                'image': c.get('Image', ''),
                'imageId': _short(c.get('ImageID')),
                'state': state.get('Status') or c.get('State'),
                'exit': state.get('ExitCode'),
                'running': bool(state.get('Running')),
                'health': {'status': health.get('Status'), 'streak': health.get('FailingStreak', 0), 'checks': [x.get('ExitCode') for x in log][-7:], 'last': ((log[-1].get('Output') or '').strip().splitlines() or [''])[-1] if log else ''} if health else None,
                'user': config.get('User') or ('root' if d.get('Config') else None),
                'service': labels.get('com.docker.compose.service'),
                'kind': 'node' if labels.get('io.x-k8s.kind.cluster') == CLUSTER else ('compose' if labels.get('com.docker.compose.project') == PROJECT else 'plain'),
                'role': labels.get('io.x-k8s.kind.role'),
                'ports': [[p.get('IP'), p.get('PublicPort'), p.get('PrivatePort'), p.get('Type')] for p in c.get('Ports') or [] if p.get('PublicPort')],
                'networks': sorted([n, v.get('IPAddress')] for n, v in ((c.get('NetworkSettings') or {}).get('Networks') or {}).items()),
                'mounts': [[m.get('Type'), m.get('Name') or m.get('Source', ''), m.get('Destination'), bool(m.get('RW', True))] for m in d.get('Mounts') or [] if not (m.get('Destination') or '').startswith('/run/secrets/')],
                'secrets': sorted(m.get('Destination') for m in d.get('Mounts') or [] if (m.get('Destination') or '').startswith('/run/secrets/')),
                'env': {k: env[k] for k in ENV_KEYS if k in env},
                'memory': host.get('Memory') or 0,
                'cpus': (host.get('NanoCpus') or 0) / 1e9,
                'restarts': d.get('RestartCount', 0),
            })
        images = []
        for img in _get('/images/json'):
            # Some image stores list a reference by digest among the tags: it goes with the digests.
            refs = [t for t in img.get('RepoTags') or [] if t != '<none>:<none>']
            tags = sorted(t for t in refs if '@' not in t)
            digests = (img.get('RepoDigests') or []) + [t for t in refs if '@' in t]
            course_tag = any(t.startswith(APP_IMAGE + ':') or t.startswith('kindest/node:') for t in tags) or any(dg.startswith('kindest/node@') for dg in digests)
            base = bool(self.base) and any(self.base.split('@')[-1] in dg for dg in digests)
            if not course_tag and not base:
                continue
            iid = img['Id']
            if iid not in self.layers:
                try:
                    self.layers[iid] = len([h for h in _get('/images/%s/history' % iid) if h.get('Size', 0) > 0])
                except DockerError:
                    self.layers[iid] = None
            images.append({
                'id': _short(iid),
                'tags': tags,
                'digest': next((dg for dg in digests), None) if not tags else None,
                'base': base,
                'baseRef': self.base if base else None,
                'created': img.get('Created'),
                'size': img.get('Size'),
                'layers': self.layers[iid],
                'users': sorted(c['name'] for c in containers if c['imageId'] == _short(iid)),
            })
        volumes = []
        for v in (_get('/volumes') or {}).get('Volumes') or []:
            if (v.get('Labels') or {}).get('com.docker.compose.project') == PROJECT:
                volumes.append({'name': v['Name'], 'users': [[c['name'], m[2]] for c in containers for m in c['mounts'] if m[1] == v['Name']]})
        networks = []
        for net in NETWORKS:
            try:
                n = _get('/networks/%s' % net)
            except DockerError:
                continue
            members = [[x.get('Name'), (x.get('IPv4Address') or '').split('/')[0]] for cid, x in (n.get('Containers') or {}).items() if not cid.startswith(self.self_id)]
            networks.append({'name': net, 'members': sorted(members)})
        app = next((c for c in containers if c['service'] == 'app' and c['running']), None)
        if app and now - self.logs_at > 2:
            self.logs_at = now
            try:
                self.logs = _log_lines(_get('/containers/%s/logs?stdout=1&stderr=1&tail=5' % app['id'], raw=True))
            except DockerError:
                self.logs = []
        self._consume(now)
        return {
            'containers': sorted(containers, key=lambda c: (c['kind'] == 'node', c['kind'] != 'compose', c['name'])),
            'images': sorted(images, key=lambda i: (i['base'], 'kindest/node' in ''.join(i['tags']) + (i['digest'] or ''), i['tags'][:1])),
            'volumes': volumes,
            'networks': networks,
            'logs': {'container': app['name'], 'lines': self.logs} if app else None,
            'hidden': hidden,
            'visorNetworks': sorted((((me or {}).get('NetworkSettings') or {}).get('Networks') or {}).keys()),
        }
