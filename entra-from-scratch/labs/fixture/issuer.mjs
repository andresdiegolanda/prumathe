// A test-token dispenser, NOT an OIDC server and NOT Microsoft Entra.
// Only the fixture profile trusts this key. Never expose this service publicly.
import http from 'node:http';
import { generateKeyPairSync, sign } from 'node:crypto';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const stranger = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'local-course-key', use: 'sig', alg: 'RS256' };
const encode = x => Buffer.from(JSON.stringify(x)).toString('base64url');
const cases = ['alice', 'bob', 'approver', 'wrong-audience', 'wrong-issuer', 'expired', 'future', 'forged', 'no-scope', 'no-role', 'other-tenant', 'app-only', 'wrong-client', 'missing-subject', 'id-token'];
function token(name) {
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: 'http://issuer:9000', aud: '22222222-2222-4222-8222-222222222222',
    tid: '11111111-1111-4111-8111-111111111111', oid: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    sub: 'pairwise-fixture-subject', azp: '33333333-3333-4333-8333-333333333333',
    ver: '2.0', iat: now, nbf: now - 5, exp: now + 300, scp: 'Requests.Read Requests.Approve', roles: []
  };
  if (name === 'bob') claims.oid = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  if (name === 'approver' || name === 'no-scope') claims.roles = ['Approver'];
  if (name === 'wrong-audience' || name === 'id-token') claims.aud = '33333333-3333-4333-8333-333333333333';
  if (name === 'id-token') delete claims.scp;
  if (name === 'wrong-issuer') claims.iss = 'https://untrusted.invalid';
  if (name === 'expired') { claims.exp = now - 120; claims.nbf = now - 600; }
  if (name === 'future') claims.nbf = now + 120;
  if (name === 'no-scope') claims.scp = 'Requests.Read';
  if (name === 'other-tenant') claims.tid = '99999999-9999-4999-8999-999999999999';
  if (name === 'wrong-client') claims.azp = '99999999-9999-4999-8999-999999999999';
  if (name === 'missing-subject') delete claims.oid;
  if (name === 'app-only') { delete claims.scp; claims.roles = ['Approver']; }
  const input = encode({ alg: 'RS256', typ: 'JWT', kid: jwk.kid }) + '.' + encode(claims);
  return input + '.' + sign('RSA-SHA256', Buffer.from(input), name === 'forged' ? stranger.privateKey : privateKey).toString('base64url');
}
http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:18094');
  const url = new URL(req.url, 'http://issuer:9000');
  if (url.pathname === '/jwks' && req.method === 'GET') return res.end(JSON.stringify({ keys: [jwk] }));
  if (url.pathname === '/health' && req.method === 'GET') return res.end(JSON.stringify({ mode: 'fixture', cases }));
  const name = url.searchParams.get('case');
  if (url.pathname === '/token' && req.method === 'GET' && cases.includes(name)) return res.end(JSON.stringify({ access_token: token(name), evidence: 'local fixture' }));
  res.writeHead(404); res.end('{}');
}).listen(9000, '0.0.0.0', () => console.log('Local fixture issuer ready; this does not authenticate people.'));
