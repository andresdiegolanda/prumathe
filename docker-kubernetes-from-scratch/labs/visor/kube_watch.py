"""The Kubernetes plane of the live viewer: the course cluster as its API server describes it.

It reads with GET requests only, over the kind network, with the credentials of the kubeconfig the
course creates in lesson 13 (the labs folder is mounted read-only). Secrets are listed as metadata
and without annotations, because kubectl apply keeps the whole manifest, data included, in one.
Those credentials could do anything in the practice cluster: what keeps the viewer read-only is this
module, and the visor suite checks it.
"""
import base64
import http.client
import json
import os
import re
import socket
import ssl
import tempfile
import time

KUBECONFIG = '/course/kubeconfig'
API = os.environ.get('K8S_API', 'prumathe-dk-control-plane:6443')
NS = 'dk-lab'
COLLECTIONS = {
    'nodes': '/api/v1/nodes',
    'pvs': '/api/v1/persistentvolumes',
    'pods': '/api/v1/namespaces/%s/pods' % NS,
    'services': '/api/v1/namespaces/%s/services' % NS,
    'configmaps': '/api/v1/namespaces/%s/configmaps' % NS,
    'pvcs': '/api/v1/namespaces/%s/persistentvolumeclaims' % NS,
    'serviceaccounts': '/api/v1/namespaces/%s/serviceaccounts' % NS,
    'events': '/api/v1/namespaces/%s/events' % NS,
    'deployments': '/apis/apps/v1/namespaces/%s/deployments' % NS,
    'replicasets': '/apis/apps/v1/namespaces/%s/replicasets' % NS,
    'endpointslices': '/apis/discovery.k8s.io/v1/namespaces/%s/endpointslices' % NS,
    'roles': '/apis/rbac.authorization.k8s.io/v1/namespaces/%s/roles' % NS,
    'rolebindings': '/apis/rbac.authorization.k8s.io/v1/namespaces/%s/rolebindings' % NS,
    'namespaces': '/api/v1/namespaces',
}
SECRETS = '/api/v1/namespaces/%s/secrets' % NS
METADATA_ONLY = 'application/json;as=PartialObjectMetadataList;g=meta.k8s.io;v=v1'
NORMAL_REASONS = {'Scheduled', 'Killing', 'ScalingReplicaSet', 'SuccessfulCreate', 'SuccessfulDelete', 'ProvisioningSucceeded'}
REPEAT_S = 15  # a repeated event (a probe that keeps failing) reaches the log at most this often


class KubeProblem(Exception):
    def __init__(self, reason, detail=''):
        super().__init__(reason)
        self.reason = reason
        self.detail = detail


def _field(text, name):
    m = re.search(name + r':\s*(\S+)', text)
    if not m:
        raise KubeProblem('bad-kubeconfig', name)
    return base64.b64decode(m.group(1))


class KubeWatch:
    def __init__(self, emit):
        self.emit = emit
        self.conn = None
        self.stamp = None
        self.dir = tempfile.mkdtemp(prefix='visor-')
        self.prev = None
        self.seen_events = {}
        self.unresolved_at = 0  # the cluster name did not resolve: not on the kind network yet
        self.on_kind = None  # what the Docker plane says about the viewer's own networks

    # ------------------------------------------------------------- connection

    def _connect(self):
        try:
            st = os.stat(KUBECONFIG)
        except OSError:
            raise KubeProblem('no-kubeconfig')
        stamp = (st.st_mtime, st.st_size)
        if self.conn is not None and stamp == self.stamp:
            return self.conn
        with open(KUBECONFIG, encoding='utf-8') as f:
            text = f.read()
        ca = _field(text, 'certificate-authority-data').decode('ascii')
        cert, key = os.path.join(self.dir, 'client.crt'), os.path.join(self.dir, 'client.key')
        for path, data in ((cert, _field(text, 'client-certificate-data')), (key, _field(text, 'client-key-data'))):
            fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
            with os.fdopen(fd, 'wb') as f:
                f.write(data)
        ctx = ssl.create_default_context(cadata=ca)
        ctx.load_cert_chain(cert, key)
        host, port = API.rsplit(':', 1)
        if self.on_kind is False or time.time() - self.unresolved_at < 3:
            raise KubeProblem('not-connected', host)
        try:
            socket.getaddrinfo(host, int(port))
        except socket.gaierror:
            self.unresolved_at = time.time()
            raise KubeProblem('not-connected', host)
        self.close()
        self.conn = http.client.HTTPSConnection(host, int(port), context=ctx, timeout=4)
        self.stamp = stamp
        return self.conn

    def close(self):
        if self.conn is not None:
            try:
                self.conn.close()
            except Exception:
                pass
        self.conn = None

    def _get(self, path, accept='application/json'):
        conn = self._connect()
        try:
            conn.request('GET', path, headers={'Accept': accept})
            res = conn.getresponse()
            body = res.read()
        except socket.gaierror:
            self.close()
            raise KubeProblem('not-connected', API)
        except (OSError, http.client.HTTPException) as e:
            self.close()
            raise KubeProblem('unreachable', type(e).__name__)
        if res.status == 404 and path.endswith('/events'):
            return {'items': []}
        if res.status != 200:
            raise KubeProblem('unreachable', 'HTTP %d' % res.status)
        return json.loads(body)

    # ------------------------------------------------------------- one reading

    def read(self, now, on_kind=None):
        self.on_kind = on_kind
        if on_kind is False:
            self.close()
        raw = {name: self._get(path).get('items') or [] for name, path in COLLECTIONS.items()}
        secrets = [{'name': s['metadata']['name']} for s in self._get(SECRETS, METADATA_ONLY).get('items') or []]
        state = self._shape(raw, secrets)
        self._diff(self.prev, state, raw['events'], now)
        self.prev = state
        return state

    @staticmethod
    def _owner(meta):
        refs = meta.get('ownerReferences') or []
        return [refs[0].get('kind'), refs[0].get('name')] if refs else None

    def _shape(self, raw, secrets):
        nodes = []
        for n in raw['nodes']:
            labels = n['metadata'].get('labels') or {}
            ready = next((c['status'] == 'True' for c in n['status'].get('conditions') or [] if c['type'] == 'Ready'), False)
            nodes.append({
                'name': n['metadata']['name'],
                'ready': ready,
                'version': (n['status'].get('nodeInfo') or {}).get('kubeletVersion'),
                'roles': sorted(k.split('/', 1)[1] for k in labels if k.startswith('node-role.kubernetes.io/')),
                'taints': ['%s:%s' % (t.get('key'), t.get('effect')) for t in n['spec'].get('taints') or []],
                'cpu': (n['status'].get('allocatable') or {}).get('cpu'),
            })
        pods = []
        for p in raw['pods']:
            meta, spec, status = p['metadata'], p['spec'], p.get('status') or {}
            c0 = (spec.get('containers') or [{}])[0]
            cs = (status.get('containerStatuses') or [{}])[0]
            waiting = ((cs.get('state') or {}).get('waiting') or {}).get('reason')
            conds = {c['type']: c for c in status.get('conditions') or []}
            sched = conds.get('PodScheduled') or {}
            probes = {k: (c0.get(k + 'Probe') or {}).get('httpGet', {}).get('path') for k in ('readiness', 'liveness', 'startup') if c0.get(k + 'Probe')}
            pods.append({
                'name': meta['name'],
                'uid': meta['uid'][:8],
                'owner': self._owner(meta),
                'phase': status.get('phase'),
                'ready': (conds.get('Ready') or {}).get('status') == 'True',
                'terminating': bool(meta.get('deletionTimestamp')),
                'waiting': waiting,
                'unschedulable': sched.get('status') == 'False' and sched.get('reason') == 'Unschedulable',
                'node': spec.get('nodeName'),
                'ip': status.get('podIP'),
                'restarts': sum(x.get('restartCount', 0) for x in status.get('containerStatuses') or []),
                'image': c0.get('image'),
                'hash': (meta.get('labels') or {}).get('pod-template-hash'),
                'labels': meta.get('labels') or {},
                'probes': probes,
                'resources': c0.get('resources') or {},
                'env': {e['name']: e.get('value') for e in c0.get('env') or [] if 'value' in e},
                'envFrom': [x.get('configMapRef', x.get('secretRef', {})).get('name') for x in c0.get('envFrom') or []],
                'claims': [v['persistentVolumeClaim']['claimName'] for v in spec.get('volumes') or [] if v.get('persistentVolumeClaim')],
            })
        deployments = []
        for d in raw['deployments']:
            spec, status, meta = d['spec'], d.get('status') or {}, d['metadata']
            tpl = spec['template']['spec']['containers'][0]
            ru = (spec.get('strategy') or {}).get('rollingUpdate') or {}
            deployments.append({
                'name': meta['name'],
                'desired': spec.get('replicas', 1),
                'ready': status.get('readyReplicas', 0),
                'updated': status.get('updatedReplicas', 0),
                'available': status.get('availableReplicas', 0),
                'revision': (meta.get('annotations') or {}).get('deployment.kubernetes.io/revision'),
                'image': tpl.get('image'),
                'env': {e['name']: e.get('value') for e in tpl.get('env') or [] if 'value' in e},
                'envFrom': [x.get('configMapRef', x.get('secretRef', {})).get('name') for x in tpl.get('envFrom') or []],
                'resources': tpl.get('resources') or {},
                'surge': ru.get('maxSurge'),
                'unavailable': ru.get('maxUnavailable'),
                'selector': (spec.get('selector') or {}).get('matchLabels') or {},
            })
        replicasets = []
        for r in raw['replicasets']:
            meta, spec, status = r['metadata'], r['spec'], r.get('status') or {}
            replicasets.append({
                'name': meta['name'],
                'owner': self._owner(meta),
                'revision': (meta.get('annotations') or {}).get('deployment.kubernetes.io/revision'),
                'desired': spec.get('replicas', 0),
                'ready': status.get('readyReplicas', 0),
                'image': spec['template']['spec']['containers'][0].get('image'),
                'hash': (meta.get('labels') or {}).get('pod-template-hash'),
            })
        services = [{
            'name': s['metadata']['name'],
            'type': s['spec'].get('type'),
            'clusterIP': s['spec'].get('clusterIP'),
            'ports': [[p.get('port'), p.get('targetPort'), p.get('protocol')] for p in s['spec'].get('ports') or []],
            'selector': s['spec'].get('selector') or {},
        } for s in raw['services']]
        slices = []
        for e in raw['endpointslices']:
            slices.append({
                'name': e['metadata']['name'],
                'service': (e['metadata'].get('labels') or {}).get('kubernetes.io/service-name'),
                'ports': [p.get('port') for p in e.get('ports') or []],
                'endpoints': [{
                    'ip': (x.get('addresses') or [None])[0],
                    'ready': (x.get('conditions') or {}).get('ready'),
                    'serving': (x.get('conditions') or {}).get('serving'),
                    'terminating': (x.get('conditions') or {}).get('terminating'),
                    'pod': (x.get('targetRef') or {}).get('name'),
                    'node': x.get('nodeName'),
                } for x in e.get('endpoints') or []],
            })
        configmaps = [{'name': c['metadata']['name'], 'data': {k: v[:200] for k, v in (c.get('data') or {}).items()}} for c in raw['configmaps'] if c['metadata']['name'] != 'kube-root-ca.crt']
        pvcs = [{
            'name': c['metadata']['name'],
            'phase': (c.get('status') or {}).get('phase'),
            'volume': c['spec'].get('volumeName'),
            'size': ((c.get('status') or {}).get('capacity') or {}).get('storage') or ((c['spec'].get('resources') or {}).get('requests') or {}).get('storage'),
            'modes': c['spec'].get('accessModes') or [],
            'class': c['spec'].get('storageClassName'),
            'users': sorted(p['name'] for p in pods if c['metadata']['name'] in p['claims']),
        } for c in raw['pvcs']]
        pvs = [{
            'name': v['metadata']['name'],
            'phase': (v.get('status') or {}).get('phase'),
            'claim': (v['spec'].get('claimRef') or {}).get('name'),
            'reclaim': v['spec'].get('persistentVolumeReclaimPolicy'),
        } for v in raw['pvs'] if (v['spec'].get('claimRef') or {}).get('namespace') == NS]
        rbac = {
            'serviceaccounts': sorted(s['metadata']['name'] for s in raw['serviceaccounts'] if s['metadata']['name'] != 'default'),
            'roles': [{'name': r['metadata']['name'], 'rules': [[x.get('apiGroups') or [], x.get('resources') or [], x.get('verbs') or []] for x in r.get('rules') or []]} for r in raw['roles']],
            'bindings': [{'name': b['metadata']['name'], 'role': (b.get('roleRef') or {}).get('name'), 'subjects': [[s.get('kind'), s.get('name')] for s in b.get('subjects') or []]} for b in raw['rolebindings']],
        }
        return {
            'namespace': any(n['metadata']['name'] == NS for n in raw['namespaces']),
            'nodes': nodes,
            'deployments': deployments,
            'replicasets': replicasets,
            'pods': pods,
            'services': services,
            'endpointslices': slices,
            'configmaps': configmaps,
            'secrets': secrets,
            'pvcs': pvcs,
            'pvs': pvs,
            'rbac': rbac,
        }

    # ------------------------------------------------------------- events

    def _diff(self, a, b, events, now):
        if a is None:
            self.emit('k8s', 'k8sStart', nodes=len(b['nodes']), pods=len(b['pods']))
            for e in events:
                self.seen_events[e['metadata']['uid']] = (e.get('count', 1), now)
            return
        by = lambda xs: {x['name']: x for x in xs}
        an, bn = by(a['nodes']), by(b['nodes'])
        for name, n in bn.items():
            if name in an and an[name]['ready'] != n['ready']:
                self.emit('k8s', 'nodeReady', node=name, ready=n['ready'])
        ap, bp = by(a['pods']), by(b['pods'])
        for name, p in bp.items():
            o = ap.get(name)
            if not o:
                self.emit('k8s', 'podCreated', pod=name, owner=p['owner'], uid=p['uid'])
                continue
            if p['terminating'] and not o['terminating']:
                self.emit('k8s', 'podTerminating', pod=name, ip=p['ip'])
            elif o['ready'] != p['ready']:
                self.emit('k8s', 'podReady', pod=name, ready=p['ready'], node=p['node'])
            if p['restarts'] > o['restarts']:
                self.emit('k8s', 'podRestarted', pod=name, restarts=p['restarts'])
        for name in ap:
            if name not in bp:
                self.emit('k8s', 'podDeleted', pod=name, owner=ap[name]['owner'])
        ad, bd = by(a['deployments']), by(b['deployments'])
        for name, d in bd.items():
            o = ad.get(name)
            if not o:
                self.emit('k8s', 'created', kind='Deployment', name=name)
                continue
            if o['desired'] != d['desired']:
                self.emit('k8s', 'desired', name=name, frm=o['desired'], to=d['desired'])
            if o['revision'] != d['revision']:
                self.emit('k8s', 'revision', name=name, revision=d['revision'], image=d['image'])
        for name in ad:
            if name not in bd:
                self.emit('k8s', 'deleted', kind='Deployment', name=name)
        ar, br = by(a['replicasets']), by(b['replicasets'])
        for name, r in br.items():
            if name not in ar:
                self.emit('k8s', 'rsCreated', name=name, revision=r['revision'], image=r['image'])
        aeps = {(s['service'], e['ip']): e for s in a['endpointslices'] for e in s['endpoints']}
        beps = {(s['service'], e['ip']): e for s in b['endpointslices'] for e in s['endpoints']}
        for key, e in beps.items():
            o = aeps.get(key)
            if o is None or bool(o['ready']) != bool(e['ready']):
                self.emit('k8s', 'endpoint', service=key[0], ip=key[1], ready=bool(e['ready']), terminating=bool(e['terminating']), pod=e['pod'])
        for key, o in aeps.items():
            if key not in beps:
                self.emit('k8s', 'endpointGone', service=key[0], ip=key[1], pod=o['pod'])
        for kind, field in (('PersistentVolumeClaim', 'pvcs'), ('Service', 'services'), ('ConfigMap', 'configmaps'), ('Secret', 'secrets')):
            x, y = by(a[field]), by(b[field])
            for name in y:
                if name not in x:
                    self.emit('k8s', 'created', kind=kind, name=name)
            for name in x:
                if name not in y:
                    self.emit('k8s', 'deleted', kind=kind, name=name)
        apv, bpv = by(a['pvcs']), by(b['pvcs'])
        for name, c in bpv.items():
            if name in apv and apv[name]['phase'] != c['phase']:
                self.emit('k8s', 'pvcPhase', name=name, phase=c['phase'])
        if a['namespace'] != b['namespace']:
            self.emit('k8s', 'namespace', present=b['namespace'])
        for e in events:
            uid, count = e['metadata']['uid'], e.get('count', 1)
            seen = self.seen_events.get(uid)
            if seen and (seen[0] == count or now - seen[1] < REPEAT_S):
                continue
            self.seen_events[uid] = (count, now)
            if e.get('type') == 'Warning' or e.get('reason') in NORMAL_REASONS:
                obj = e.get('involvedObject') or {}
                self.emit('k8s', 'kevent', type=e.get('type'), reason=e.get('reason'), kind=obj.get('kind'), name=obj.get('name'), message=(e.get('message') or '')[:240], count=count)
