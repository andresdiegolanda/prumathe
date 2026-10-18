"""Teaching HTTP service. Deliberate failure switches live only inside each container."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json, os, signal, socket, sys

# As PID 1 the process would ignore SIGTERM; exit at once so stop and delete do not wait for SIGKILL.
signal.signal(signal.SIGTERM, lambda signum, frame: sys.exit(0))

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        status = 200
        if self.path in ('/health', '/ready'):
            flag = '/tmp/fail-live' if self.path == '/health' else '/tmp/not-ready'
            status = 503 if Path(flag).exists() else 200
            body = {'status': 'ok' if status == 200 else 'unavailable'}
        else:
            body = {'service': 'signal', 'version': os.getenv('APP_VERSION', '1.0.0'),
                    'message': os.getenv('MESSAGE', 'hello'), 'host': socket.gethostname(),
                    'secret_mounted': Path('/run/secrets/demo_token').is_file()}
        payload = (json.dumps(body) + '\n').encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

ThreadingHTTPServer(('0.0.0.0', 8080), Handler).serve_forever()
