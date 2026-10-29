/* Deterministic teaching models. No token, database or tenant is contacted here. */
window.EntraVisuals = (() => {
  const palettes = {
    light:{ink:'#20342c',muted:'#61746a',green:'#21664e',orange:'#b75c25',red:'#a73535',white:'#fffef8',panel:'#eeeee4',line:'#ccd6cb',mint:'#dcebdc',amber:'#f3dfbd'},
    dark:{ink:'#e5ede6',muted:'#9ab3a2',green:'#86c99c',orange:'#efb878',red:'#f28e8e',white:'#17281f',panel:'#20382b',line:'#3e5948',mint:'#284d38',amber:'#594528'},
    reading:{ink:'#2d302b',muted:'#66695e',green:'#345e42',orange:'#a25c2a',red:'#a73535',white:'#fffdf4',panel:'#f1eddf',line:'#d6d0bc',mint:'#e2ead7',amber:'#f4e4c5'},
    projector:{ink:'#10271b',muted:'#3a5142',green:'#145a32',orange:'#914414',red:'#982b2b',white:'#ffffff',panel:'#f1f5ef',line:'#9fac9d',mint:'#d4eacf',amber:'#f8dca5'}
  };
  const palette = name => palettes[name] || palettes.light;
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(kind, scene=0, state={}, lang='en', theme='light') {
    const C=palette(theme), details={}, controls=[];
    let body='', result='', detail='';
    const text=(x,y,label,size=17,color=C.ink,anchor='middle')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}">${esc(label)}</text>`;
    const box=(id,x,y,w,title,sub,description,color=C.green)=>{
      details[id]=description;
      return `<g role="button" tabindex="0" class="selectable" data-node="${id}" aria-label="${esc(title)}"><rect x="${x}" y="${y}" width="${w}" height="82" rx="12" fill="${C.white}" stroke="${color}" stroke-width="2"/>${text(x+w/2,y+32,title,18,color)}${text(x+w/2,y+59,sub,13,C.muted)}</g>`;
    };
    const arrow=(x,y,x2,y2,color=C.green)=>`<path d="M${x} ${y} L${x2} ${y2}" stroke="${color}" stroke-width="2" fill="none" marker-end="url(#arrow-${theme})"/>`;
    const select=(key,label,options,initial)=>{
      const value=options.includes(state[key])?state[key]:initial;
      controls.push({kind:'select',key,label,options,value}); return value;
    };
    const toggle=(key,label,initial='Yes')=>select(key,label,['Yes','No'],initial)==='Yes';
    const band=(y,label,value,ok)=>`<rect x="65" y="${y}" width="630" height="48" rx="8" fill="${ok?C.mint:C.amber}"/>${text(85,y+30,label,16,C.ink,'start')}${text(674,y+30,value,16,ok?C.green:C.red,'end')}`;
    if(kind==='boundaries') {
      const fault=select('fault','First failing boundary',['None','Token','Operation','Row'],['None','Operation','Row'][scene]);
      body+=box('entra',270,36,220,'Microsoft Entra','Sign-in and issuance','Authenticates the user under tenant policy and issues a resource-specific access token. It does not query purchase ownership.');
      body+=box('angular',30,196,200,'Angular','Presents a request','A public client under the user\'s control. It acquires tokens with MSAL; its interface is not the API security boundary.');
      body+=box('spring',280,196,200,'Spring API','Validates and decides','Checks token signature, issuer, audience, time and application contract, then scope and role. Rejects before SQL when those checks fail.',fault==='Token'||fault==='Operation'?C.red:C.green);
      body+=box('postgres',530,196,200,'PostgreSQL','Constrains rows','Authenticates the runtime database role. Parameterized predicates and RLS constrain the requested row within the transaction.',fault==='Row'?C.red:C.green);
      body+=arrow(270,100,130,190)+arrow(232,237,274,237)+arrow(482,237,524,237);
      body+=text(198,148,'API access token',13,C.muted)+text(380,325,'Token evidence → operation policy → row policy',17);
      result={None:'200 · the requested read is permitted',Token:'401 · no accepted token',Operation:'403 · required operation authority is missing',Row:'404 · no row satisfies the endpoint policy'}[fault];
      detail='The model illustrates the sample contract; it has not sent an HTTP request.';
    } else if(kind==='policy') {
      const scope=toggle('scope','Approval scope'),role=toggle('role','Approver role',scene===0?'No':'Yes');
      const own=toggle('own','Own request',scene===2?'Yes':'No');
      const pending=toggle('pending','Pending state');
      body+=box('token',225,35,310,'Accepted API token','Authentication already succeeded','This model starts after token validation. Its controls change authorization requirements, not the trust of the signature.');
      body+=band(145,'Delegated Requests.Approve',scope?'PRESENT':'MISSING',scope);
      body+=band(205,'User role Approver',role?'PRESENT':'MISSING',role);
      body+=band(265,'Other owner in the accepted tenant',own?'SELF-APPROVAL':'OTHER OWNER',!own);
      body+=band(325,'Record is pending',pending?'PENDING':'ALREADY APPROVED',pending);
      result=!scope||!role?'403 · the operation gate denies':own||!pending?'404 · no eligible row to update':'200 · one permitted state transition';
      detail='Approval = accepted token AND scope AND role AND tenant AND other owner AND pending.';
    } else if(kind==='registrations') {
      const focus=select('focus','Inspect',['SPA client','API resource','Tenant'],['SPA client','API resource','Tenant'][scene]);
      body+=`<rect x="35" y="35" width="690" height="340" rx="18" stroke="${C.line}" fill="${C.panel}"/>`+text(380,72,'One workforce tenant · T',18);
      body+=box('spa',70,110,270,'SPA registration · S','Public client + redirect URI','S is the client identifier. It belongs in MSAL configuration. No browser client secret is created.',focus==='SPA client'?C.orange:C.green);
      body+=box('api',420,110,270,'API registration · A','Scopes + app role','A is the API resource identifier. API access tokens must have the intended API audience. The API defines its scope and role vocabulary.',focus==='API resource'?C.orange:C.green);
      body+=box('spa-sp',70,270,270,'SPA service principal','Tenant-local application instance','The SPA has a service principal in the tenant. Its object ID is different from its application client ID.');
      body+=box('api-sp',420,270,270,'API service principal','User role assignment','Assign the Approver user role on the API Enterprise application. Assignment is not a SQL ownership rule.');
      body+=arrow(205,194,205,264)+arrow(555,194,555,264)+arrow(342,151,412,151);
      result=focus==='SPA client'?'Client S requests access to resource A':focus==='API resource'?'ID token: aud S · API access token: aud A':'Identity key: accepted tenant T + user object oid';
      detail='A client ID names an application. An object ID names a directory object.';
    } else if(kind==='pkce') {
      const phase=select('phase','Flow step',['Authorize','Return code','Redeem','Call API'],['Authorize','Redeem','Call API'][scene]);
      const verifier=toggle('verifier','Original verifier available');
      const positions=['Authorize','Return code','Redeem','Call API'];
      body+=box('client',40,45,250,'Angular + MSAL','Keeps the verifier','The public client initializes MSAL, starts an interaction, handles the callback and acquires tokens for the intended API.');
      body+=box('provider',465,45,250,'Entra endpoints','Sign-in + token issuance','The identity provider handles credentials and code redemption. The local fixture does not implement these endpoints.');
      const labels=['1  Client + scopes + challenge','2  Registered callback + code','3  Code + original verifier','4  Access token → Spring API'];
      labels.forEach((label,i)=>{body+=band(155+i*55,label,phase===positions[i]?'CURRENT':'',phase===positions[i]);});
      body+=arrow(292,84,455,84);
      result=phase==='Redeem'&&!verifier?'Redemption denied · challenge proof does not match':phase==='Call API'?'PKCE is complete; API validation and authorization still apply':'Trace '+phase.toLowerCase()+' before proceeding';
      detail='The model illustrates protocol roles. It performs no authentication or token exchange.';
    } else if(kind==='tokens') {
      const type=select('token','Credential',['API access token','SPA ID token','Graph access token'],scene===0?'SPA ID token':'API access token');
      const valid=toggle('signature','Trusted signature');
      body+=box('credential',135,40,490,type,type==='API access token'?'aud = purchase API':type==='SPA ID token'?'aud = SPA client':'aud = Microsoft Graph','A token has an intended recipient. Decoding claims does not validate the signature or make it acceptable to another audience.',C.orange);
      body+=band(158,'Signature from a configured trust root',valid?'VALID':'INVALID',valid);
      body+=band(220,'Audience matches the purchase API',type==='API access token'?'MATCH':'MISMATCH',type==='API access token');
      body+=box('recipient',225,310,310,'Spring resource server','Then evaluate scopes and row rules','A valid token must satisfy the complete resource contract. Passing signature and audience alone does not grant an operation.');
      result=valid&&type==='API access token'?'Proceed to the remaining validation and policy checks':'401 · reject before business authorization';
      detail='Other checks still include issuer, time, tenant, subject, allowed client and delegated access.';
    } else if(kind==='rows') {
      const user=select('user','Caller',['Alice','Bob','Approver'],['Alice','Bob','Approver'][scene]);
      const tenant=select('tenant','Data tenant',['Accepted tenant','Other tenant'],'Accepted tenant');
      const readAll=select('path','Query',['Owner read endpoint','Unscoped SELECT with RLS'],'Owner read endpoint');
      const rows=[['41','Alice','Accepted tenant'],['42','Bob','Accepted tenant'],['43','Alice','Other tenant']];
      body+=text(380,54,'Authenticated caller: '+user+' · '+tenant,19);
      rows.forEach(([id,owner,t],i)=>{
        // Approver is Alice with the Approver role, as in the fixture.
        const subject=user==='Approver'?'Alice':user;
        const visible=t===tenant && (owner===subject || user==='Approver'&&readAll==='Unscoped SELECT with RLS');
        body+=box('row'+id,110,100+i*95,540,'Request '+id+' · '+owner,t+' · '+(visible?'VISIBLE':'FILTERED'),`Stored owner: ${owner}. Stored tenant: ${t}. ${visible?'Matches this query context.':'Does not match this query context.'}`,visible?C.green:C.red);
      });
      result=tenant==='Other tenant'?'Counterfactual SQL context only: the API rejects this tenant':'Identity is derived from the accepted principal';
      detail=readAll==='Owner read endpoint'?'Owner read endpoint remains owner-only, even for an approver.':'RLS permits an approver broader rows; the endpoint can impose narrower rules.';
    } else if(kind==='database') {
      const context=select('context','Context lifetime',['Transaction-local','Session-lived'],scene===2?'Session-lived':'Transaction-local');
      const role=select('dbrole','Database role',['Runtime role','Superuser'],'Runtime role');
      body+=box('req1',60,65,260,'Request 1 · Alice','BEGIN → context → query → COMMIT','Set validated tenant and subject with transaction-local settings on the same connection used for the query.');
      body+=box('pool',440,65,260,'Connection pool','Reuses a physical connection','Reuse does not imply a new physical session. Session-wide state can outlive a request.');
      body+=arrow(322,106,430,106);
      body+=box('req2',60,245,260,'Request 2 · Bob','A different principal','Every request establishes fresh context. Without context, the runtime RLS policy denies rows.');
      body+=box('db',440,245,260,'PostgreSQL',role,'The runtime role does not own the table and is neither superuser nor BYPASSRLS. A superuser can bypass RLS.',role==='Superuser'?C.red:C.green);
      body+=arrow(570,150,570,234)+arrow(322,286,430,286);
      result=role==='Superuser'?'RLS is bypassed by this privileged role':context==='Session-lived'?'Unsafe design: Alice context can survive connection reuse':'After COMMIT, Alice\'s transaction-local context is gone';
      detail='The sample uses transaction-local settings, explicit SQL predicates and a restricted runtime role.';
    } else if(kind==='lifecycle') {
      const time=select('time','Request time',['Before role removal','After role removal','After token expiry'],['Before role removal','After role removal','After token expiry'][scene]);
      body+=text(380,55,'A token records claims at issuance',22);
      body+=arrow(90,170,680,170);
      [['Issued',100],['Role removed',380],['Expires',660]].forEach(([label,x])=>{body+=`<circle cx="${x}" cy="170" r="10" fill="${C.green}"/>`+text(x,140,label,15);});
      body+=box('snapshot',170,240,420,'roles: [Approver]','Snapshot, not a directory query','The JWT does not rewrite itself when an assignment changes. Additional online enforcement and renewal behavior need an explicit design.');
      result=time==='After token expiry'?'401 · expired beyond the allowed clock skew':time==='After role removal'?'Local JWT validation may still accept the older role claim':'Proceed only if every API and row check also passes';
      detail='Sign-out, cache clearing, token expiry and online revocation are separate events.';
    } else throw new Error('Unknown visual: '+kind);
    body+=`<rect x="25" y="412" width="710" height="92" rx="12" fill="${C.panel}"/>`+text(380,447,result,17,C.ink)+text(380,478,detail,12,C.muted);
    return {svg:`<svg viewBox="0 0 760 530" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="${esc(kind+' illustrative model')}"><defs><marker id="arrow-${theme}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${C.green}"/></marker></defs><g font-family="Segoe UI,system-ui,sans-serif">${body}</g></svg>`,details,controls};
  }
  return {render,palette};
})();
