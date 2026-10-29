// Local configuration and invented practice rows only. This script never writes to Entra.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url));
const [mode,...args]=process.argv.slice(2);
const fixture=['11111111-1111-4111-8111-111111111111','33333333-3333-4333-8333-333333333333','22222222-2222-4222-8222-222222222222','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'];
if(!['fixture','entra'].includes(mode)||(mode==='entra'&&args.length!==5)) {
  console.log('Usage: node configure.mjs fixture');
  console.log('   or: node configure.mjs entra TENANT_ID SPA_CLIENT_ID API_CLIENT_ID ALICE_OID BOB_OID');
  process.exit(1);
}
const ids=mode==='fixture'?fixture:args;
if(!ids.every(x=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x))) throw new Error('Every identifier must be a UUID.');
const [tenantId,spaClientId,apiClientId,alice,bob]=ids;
if(alice===bob||spaClientId===apiClientId)throw new Error('Use two distinct users and two distinct application client IDs.');
const query=`UPDATE purchase_request SET tenant_id='${tenantId}', owner_oid='${alice}', status='PENDING' WHERE id=41; UPDATE purchase_request SET tenant_id='${tenantId}', owner_oid='${bob}', status='PENDING' WHERE id=42;`;
const result=spawnSync('docker',['compose','-f',path.join(root,'compose.yaml'),'exec','-T','db','psql','-X','-v','ON_ERROR_STOP=1','-U','course_admin','-d','procurement','-c',query],{encoding:'utf8'});
if(result.status!==0)throw new Error(result.stderr||'Start the local database before configuring the lab.');
fs.writeFileSync(path.join(root,'.env'),`AUTH_MODE=${mode}\nTENANT_ID=${tenantId}\nSPA_CLIENT_ID=${spaClientId}\nAPI_CLIENT_ID=${apiClientId}\n`);
fs.writeFileSync(path.join(root,'frontend/public/config.json'),JSON.stringify({mode,tenantId,spaClientId,apiClientId},null,2)+'\n');
console.log('Configured '+mode+' mode and reset only practice rows 41 and 42.');
console.log('Recreate the API: docker compose up -d --force-recreate api');
console.log('Reload the Angular application. Mode mismatches are rejected.');
