import assert from 'node:assert/strict';
const api='http://127.0.0.1:18095';
const health=await fetch(api+'/health').then(r=>r.json());
assert.equal(health.authMode,'entra','Switch to Entra mode first.');
const fixture=await fetch('http://127.0.0.1:18096/token?case=alice').then(r=>r.json());
const response=await fetch(api+'/api/requests/41',{headers:{Authorization:'Bearer '+fixture.access_token}});
assert.equal(response.status,401);
console.log('PASS Entra-mode API rejected the fixture credential with 401. This does not prove a real user signed in.');
