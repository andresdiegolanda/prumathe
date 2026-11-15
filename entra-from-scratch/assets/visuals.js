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
    const t=(en,es)=>lang==='es'?es:en;
    let body='', result='', detail='';
    const text=(x,y,label,size=17,color=C.ink,anchor='middle')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}">${esc(label)}</text>`;
    const box=(id,x,y,w,title,sub,description,color=C.green)=>{
      details[id]=description;
      return `<g role="button" tabindex="0" class="selectable" data-node="${id}" aria-label="${esc(title)}"><rect x="${x}" y="${y}" width="${w}" height="82" rx="12" fill="${C.white}" stroke="${color}" stroke-width="2"/>${text(x+w/2,y+32,title,18,color)}${text(x+w/2,y+59,sub,13,C.muted)}</g>`;
    };
    const arrow=(x,y,x2,y2,color=C.green)=>`<path d="M${x} ${y} L${x2} ${y2}" stroke="${color}" stroke-width="2" fill="none" marker-end="url(#arrow-${theme})"/>`;
    // An option is [value, Spanish label]: the value drives the model and is the English label.
    const select=(key,label,options,initial)=>{
      const opts=options.map(([value,es])=>({value,label:{en:value,es}}));
      const value=opts.some(o=>o.value===state[key])?state[key]:initial;
      controls.push({kind:'select',key,label,options:opts,value}); return value;
    };
    const say=(options,value)=>{const o=options.find(([v])=>v===value);return t(o[0],o[1]);};
    const toggle=(key,label,initial='Yes')=>select(key,label,[['Yes','Sí'],['No','No']],initial)==='Yes';
    const band=(y,label,value,ok)=>`<rect x="65" y="${y}" width="630" height="48" rx="8" fill="${ok?C.mint:C.amber}"/>${text(85,y+30,label,16,C.ink,'start')}${text(674,y+30,value,16,ok?C.green:C.red,'end')}`;
    if(kind==='boundaries') {
      const fault=select('fault',t('First failing boundary','Primer límite que falla'),[['None','Ninguno'],['Token','Token'],['Operation','Operación'],['Row','Fila']],['None','Operation','Row'][scene]);
      body+=box('entra',270,36,220,'Microsoft Entra',t('Sign-in and issuance','Inicio de sesión y emisión'),t('Authenticates the user under tenant policy and issues a resource-specific access token. It does not query purchase ownership.','Autentica al usuario según la política del tenant y emite un access token para un recurso concreto. No consulta de quién es cada solicitud de compra.'));
      body+=box('angular',30,196,200,'Angular',t('Presents a request','Presenta una solicitud'),t('A public client under the user\'s control. It acquires tokens with MSAL; its interface is not the API security boundary.','Un cliente público bajo el control del usuario. Obtiene tokens con MSAL; su interfaz no es el límite de seguridad de la API.'));
      body+=box('spring',280,196,200,'Spring API',t('Validates and decides','Valida y decide'),t('Checks token signature, issuer, audience, time and application contract, then scope and role. Rejects before SQL when those checks fail.','Verifica del token la firma, el issuer, la audiencia, el tiempo y el contrato de la aplicación, y después scope y rol. Rechaza antes del SQL si algo de eso falla.'),fault==='Token'||fault==='Operation'?C.red:C.green);
      body+=box('postgres',530,196,200,'PostgreSQL',t('Constrains rows','Restringe filas'),t('Authenticates the runtime database role. Parameterized predicates and RLS constrain the requested row within the transaction.','Autentica el rol de base de datos de ejecución. Los predicados parametrizados y RLS restringen la fila pedida dentro de la transacción.'),fault==='Row'?C.red:C.green);
      body+=arrow(270,100,130,190)+arrow(232,237,274,237)+arrow(482,237,524,237);
      body+=text(198,148,t('API access token','access token de la API'),13,C.muted)+text(380,325,t('Token evidence → operation policy → row policy','Evidencia del token → política de la operación → política de filas'),17);
      result={None:t('200 · the requested read is permitted','200 · la lectura pedida está permitida'),Token:t('401 · no accepted token','401 · no hay un token aceptado'),Operation:t('403 · required operation authority is missing','403 · falta la authority que exige la operación'),Row:t('404 · no row satisfies the endpoint policy','404 · ninguna fila cumple la política del endpoint')}[fault];
      detail=t('The model illustrates the sample contract; it has not sent an HTTP request.','El modelo ilustra el contrato del ejemplo; no envió ningún pedido HTTP.');
    } else if(kind==='policy') {
      const scope=toggle('scope',t('Approval scope','Scope de aprobación')),role=toggle('role',t('Approver role','Rol Approver'),scene===0?'No':'Yes');
      const own=toggle('own',t('Own request','Solicitud propia'),scene===2?'Yes':'No');
      const pending=toggle('pending',t('Pending state','Estado pendiente'));
      body+=box('token',225,35,310,t('Accepted API token','Token de la API aceptado'),t('Authentication already succeeded','La autenticación ya se cumplió'),t('This model starts after token validation. Its controls change authorization requirements, not the trust of the signature.','Este modelo empieza después de validar el token. Sus controles cambian requisitos de autorización, no la confianza en la firma.'));
      body+=band(145,t('Delegated Requests.Approve','Requests.Approve delegado'),scope?t('PRESENT','PRESENTE'):t('MISSING','FALTA'),scope);
      body+=band(205,t('User role Approver','Rol de usuario Approver'),role?t('PRESENT','PRESENTE'):t('MISSING','FALTA'),role);
      body+=band(265,t('Other owner in the accepted tenant','Otro dueño en el tenant aceptado'),own?t('SELF-APPROVAL','AUTOAPROBACIÓN'):t('OTHER OWNER','OTRO DUEÑO'),!own);
      body+=band(325,t('Record is pending','El registro está pendiente'),pending?t('PENDING','PENDIENTE'):t('ALREADY APPROVED','YA APROBADO'),pending);
      result=!scope||!role?t('403 · the operation gate denies','403 · la regla de la operación rechaza'):own||!pending?t('404 · no eligible row to update','404 · no hay una fila elegible para actualizar'):t('200 · one permitted state transition','200 · una transición de estado permitida');
      detail=t('Approval = accepted token AND scope AND role AND tenant AND other owner AND pending.','Aprobar = token aceptado Y scope Y rol Y tenant Y otro dueño Y pendiente.');
    } else if(kind==='registrations') {
      const focus=select('focus',t('Inspect','Inspeccionar'),[['SPA client','Cliente SPA'],['API resource','Recurso API'],['Tenant','Tenant']],['SPA client','API resource','Tenant'][scene]);
      body+=`<rect x="35" y="35" width="690" height="340" rx="18" stroke="${C.line}" fill="${C.panel}"/>`+text(380,72,t('One workforce tenant · T','Un tenant workforce · T'),18);
      body+=box('spa',70,110,270,t('SPA registration · S','Registro de la SPA · S'),t('Public client + redirect URI','Cliente público + redirect URI'),t('S is the client identifier. It belongs in MSAL configuration. No browser client secret is created.','S es el identificador del cliente. Va en la configuración de MSAL. No se crea ningún client secret para el navegador.'),focus==='SPA client'?C.orange:C.green);
      body+=box('api',420,110,270,t('API registration · A','Registro de la API · A'),'Scopes + app role',t('A is the API resource identifier. API access tokens must have the intended API audience. The API defines its scope and role vocabulary.','A es el identificador de la API como recurso. Los access tokens de la API tienen que traer esa audiencia. La API define su vocabulario de scopes y roles.'),focus==='API resource'?C.orange:C.green);
      body+=box('spa-sp',70,270,270,t('SPA service principal','Service principal (SPA)'),t('Tenant-local application instance','Instancia de la aplicación en el tenant'),t('The SPA has a service principal in the tenant. Its object ID is different from its application client ID.','La SPA tiene un service principal en el tenant. Su object ID es distinto de su client ID.'));
      body+=box('api-sp',420,270,270,t('API service principal','Service principal (API)'),t('User role assignment','Asignación del rol de usuario'),t('Assign the Approver user role on the API Enterprise application. Assignment is not a SQL ownership rule.','Asigná el rol de usuario Approver en la Enterprise application de la API. Una asignación no es una regla de propiedad en SQL.'));
      body+=arrow(205,194,205,264)+arrow(555,194,555,264)+arrow(342,151,412,151);
      result=focus==='SPA client'?t('Client S requests access to resource A','El cliente S pide acceso al recurso A'):focus==='API resource'?t('ID token: aud S · API access token: aud A','ID token: aud S · access token de la API: aud A'):t('Identity key: accepted tenant T + user object oid','Clave de identidad: tenant aceptado T + oid del usuario');
      detail=t('A client ID names an application. An object ID names a directory object.','Un client ID nombra una aplicación. Un object ID nombra un objeto del directorio.');
    } else if(kind==='pkce') {
      const steps=[['Authorize','Autorizar'],['Return code','Devolver el code'],['Redeem','Canjear'],['Call API','Llamar a la API']];
      const phase=select('phase',t('Flow step','Paso del flujo'),steps,['Authorize','Redeem','Call API'][scene]);
      const verifier=toggle('verifier',t('Original verifier available','Verifier original disponible'));
      const positions=steps.map(([v])=>v);
      body+=box('client',40,45,250,'Angular + MSAL',t('Keeps the verifier','Guarda el verifier'),t('The public client initializes MSAL, starts an interaction, handles the callback and acquires tokens for the intended API.','El cliente público inicializa MSAL, arranca una interacción, procesa el callback y obtiene tokens para la API que corresponde.'));
      body+=box('provider',465,45,250,t('Entra endpoints','Endpoints de Entra'),t('Sign-in + token issuance','Inicio de sesión + emisión de tokens'),t('The identity provider handles credentials and code redemption. The local fixture does not implement these endpoints.','El proveedor de identidad maneja las credenciales y el canje del code. El fixture local no implementa estos endpoints.'));
      const labels=[t('1  Client + scopes + challenge','1  Cliente + scopes + challenge'),t('2  Registered callback + code','2  Callback registrado + code'),t('3  Code + original verifier','3  Code + verifier original'),t('4  Access token → Spring API','4  Access token → API de Spring')];
      labels.forEach((label,i)=>{body+=band(155+i*55,label,phase===positions[i]?t('CURRENT','ACTUAL'):'',phase===positions[i]);});
      body+=arrow(292,84,455,84);
      result=phase==='Redeem'&&!verifier?t('Redemption denied · challenge proof does not match','Canje rechazado · la prueba del challenge no coincide'):phase==='Call API'?t('PKCE is complete; API validation and authorization still apply','PKCE terminó; la validación y la autorización de la API siguen valiendo'):t('Trace '+phase.toLowerCase()+' before proceeding','Seguí el paso "'+say(steps,phase)+'" antes de avanzar');
      detail=t('The model illustrates protocol roles. It performs no authentication or token exchange.','El modelo ilustra los roles del protocolo. No autentica ni canjea tokens.');
    } else if(kind==='tokens') {
      const types=[['API access token','Access token de la API'],['SPA ID token','ID token de la SPA'],['Graph access token','Access token de Graph']];
      const type=select('token',t('Credential','Credencial'),types,scene===0?'SPA ID token':'API access token');
      const valid=toggle('signature',t('Trusted signature','Firma confiable'));
      body+=box('credential',135,40,490,say(types,type),type==='API access token'?t('aud = purchase API','aud = API de compras'):type==='SPA ID token'?t('aud = SPA client','aud = cliente SPA'):'aud = Microsoft Graph',t('A token has an intended recipient. Decoding claims does not validate the signature or make it acceptable to another audience.','Un token tiene un destinatario previsto. Decodificar los claims no valida la firma ni lo vuelve aceptable para otra audiencia.'),C.orange);
      body+=band(158,t('Signature from a configured trust root','Firma de una raíz de confianza configurada'),valid?t('VALID','VÁLIDA'):t('INVALID','INVÁLIDA'),valid);
      body+=band(220,t('Audience matches the purchase API','La audiencia coincide con la API de compras'),type==='API access token'?t('MATCH','COINCIDE'):t('MISMATCH','NO COINCIDE'),type==='API access token');
      body+=box('recipient',225,310,310,t('Spring resource server','Resource server de Spring'),t('Then evaluate scopes and row rules','Después evalúa scopes y reglas de filas'),t('A valid token must satisfy the complete resource contract. Passing signature and audience alone does not grant an operation.','Un token válido tiene que cumplir el contrato completo del recurso. Pasar firma y audiencia no habilita por sí solo una operación.'));
      result=valid&&type==='API access token'?t('Proceed to the remaining validation and policy checks','Seguí con el resto de la validación y las políticas'):t('401 · reject before business authorization','401 · se rechaza antes de la autorización de negocio');
      detail=t('Other checks still include issuer, time, tenant, subject, allowed client and delegated access.','Faltan otras verificaciones: issuer, tiempo, tenant, sujeto, cliente permitido y acceso delegado.');
    } else if(kind==='rows') {
      const tenants=[['Accepted tenant','Tenant aceptado'],['Other tenant','Otro tenant']];
      const user=select('user',t('Caller','Quien llama'),[['Alice','Alice'],['Bob','Bob'],['Approver','Approver']],['Alice','Bob','Approver'][scene]);
      const tenant=select('tenant',t('Data tenant','Tenant de los datos'),tenants,'Accepted tenant');
      const readAll=select('path',t('Query','Consulta'),[['Owner read endpoint','Endpoint de lectura del dueño'],['Unscoped SELECT with RLS','SELECT sin filtro con RLS']],'Owner read endpoint');
      const rows=[['41','Alice','Accepted tenant'],['42','Bob','Accepted tenant'],['43','Alice','Other tenant']];
      body+=text(380,54,t('Authenticated caller: ','Quien llama, autenticado: ')+user+' · '+say(tenants,tenant),19);
      rows.forEach(([id,owner,tn],i)=>{
        // Approver is Alice with the Approver role, as in the fixture.
        const subject=user==='Approver'?'Alice':user;
        const visible=tn===tenant && (owner===subject || user==='Approver'&&readAll==='Unscoped SELECT with RLS');
        body+=box('row'+id,110,100+i*95,540,t('Request ','Solicitud ')+id+' · '+owner,say(tenants,tn)+' · '+(visible?'VISIBLE':t('FILTERED','FILTRADA')),t(`Stored owner: ${owner}. Stored tenant: ${tn}. ${visible?'Matches this query context.':'Does not match this query context.'}`,`Dueño guardado: ${owner}. Tenant guardado: ${say(tenants,tn)}. ${visible?'Coincide con el contexto de esta consulta.':'No coincide con el contexto de esta consulta.'}`),visible?C.green:C.red);
      });
      result=tenant==='Other tenant'?t('Counterfactual SQL context only: the API rejects this tenant','Solo un contexto SQL hipotético: la API rechaza este tenant'):t('Identity is derived from the accepted principal','La identidad sale del principal aceptado');
      detail=readAll==='Owner read endpoint'?t('Owner read endpoint remains owner-only, even for an approver.','El endpoint de lectura sigue siendo solo del dueño, aun para un aprobador.'):t('RLS permits an approver broader rows; the endpoint can impose narrower rules.','RLS le permite más filas a un aprobador; el endpoint puede imponer reglas más estrechas.');
    } else if(kind==='database') {
      const roles=[['Runtime role','Rol de ejecución'],['Superuser','Superusuario']];
      const context=select('context',t('Context lifetime','Vida del contexto'),[['Transaction-local','Local a la transacción'],['Session-lived','De toda la sesión']],scene===2?'Session-lived':'Transaction-local');
      const role=select('dbrole',t('Database role','Rol de base de datos'),roles,'Runtime role');
      body+=box('req1',60,65,260,t('Request 1 · Alice','Pedido 1 · Alice'),t('BEGIN → context → query → COMMIT','BEGIN → contexto → SQL → COMMIT'),t('Set validated tenant and subject with transaction-local settings on the same connection used for the query.','Fija el tenant y el sujeto validados con settings locales a la transacción, en la misma conexión que usa la consulta.'));
      body+=box('pool',440,65,260,t('Connection pool','Pool de conexiones'),t('Reuses a physical connection','Reusa una conexión física'),t('Reuse does not imply a new physical session. Session-wide state can outlive a request.','Reusar no implica una sesión física nueva. El estado de toda la sesión puede sobrevivir a un pedido.'));
      body+=arrow(322,106,430,106);
      body+=box('req2',60,245,260,t('Request 2 · Bob','Pedido 2 · Bob'),t('A different principal','Otro principal'),t('Every request establishes fresh context. Without context, the runtime RLS policy denies rows.','Cada pedido arma un contexto nuevo. Sin contexto, la política RLS no le devuelve filas al rol de ejecución.'));
      body+=box('db',440,245,260,'PostgreSQL',say(roles,role),t('The runtime role does not own the table and is neither superuser nor BYPASSRLS. A superuser can bypass RLS.','El rol de ejecución no es dueño de la tabla y no es superusuario ni BYPASSRLS. Un superusuario puede saltear RLS.'),role==='Superuser'?C.red:C.green);
      body+=arrow(570,150,570,234)+arrow(322,286,430,286);
      result=role==='Superuser'?t('RLS is bypassed by this privileged role','Este rol privilegiado se saltea RLS'):context==='Session-lived'?t('Unsafe design: Alice context can survive connection reuse','Diseño inseguro: el contexto de Alice sobrevive al reusar la conexión'):t('After COMMIT, Alice\'s transaction-local context is gone','Después del COMMIT, el contexto local de Alice ya no existe');
      detail=t('The sample uses transaction-local settings, explicit SQL predicates and a restricted runtime role.','El ejemplo usa settings locales a la transacción, predicados SQL explícitos y un rol de ejecución restringido.');
    } else if(kind==='lifecycle') {
      const times=[['Before role removal','Antes de quitar el rol'],['After role removal','Después de quitar el rol'],['After token expiry','Después de que vence el token']];
      const time=select('time',t('Request time','Momento del pedido'),times,times[scene][0]);
      body+=text(380,55,t('A token records claims at issuance','Un token registra claims al emitirse'),22);
      body+=arrow(90,170,680,170);
      [[t('Issued','Emitido'),100],[t('Role removed','Rol quitado'),380],[t('Expires','Vence'),660]].forEach(([label,x])=>{body+=`<circle cx="${x}" cy="170" r="10" fill="${C.green}"/>`+text(x,140,label,15);});
      body+=box('snapshot',170,240,420,'roles: [Approver]',t('Snapshot, not a directory query','Una foto, no una consulta al directorio'),t('The JWT does not rewrite itself when an assignment changes. Additional online enforcement and renewal behavior need an explicit design.','El JWT no se reescribe cuando cambia una asignación. Hacer cumplir en línea y renovar necesitan un diseño explícito.'));
      result=time==='After token expiry'?t('401 · expired beyond the allowed clock skew','401 · vencido más allá del desfasaje de reloj permitido'):time==='After role removal'?t('Local JWT validation may still accept the older role claim','La validación local del JWT puede seguir aceptando el claim del rol viejo'):t('Proceed only if every API and row check also passes','Avanzá solo si también pasan todas las verificaciones de la API y de filas');
      detail=t('Sign-out, cache clearing, token expiry and online revocation are separate events.','Cerrar sesión, limpiar la caché, el vencimiento del token y la revocación en línea son eventos distintos.');
    } else if(kind==='device') {
      const moments=[['Windows sign-in','Inicio de sesión de Windows'],['Open the app','Abrir la app'],['After 24 hours','24 horas después']];
      const moment=select('moment',t('Moment','Momento'),moments,moments[scene][0]);
      const joined=select('device',t('Device','Dispositivo'),[['Joined to Entra','Unido a Entra'],['No Entra identity','Sin identidad de Entra']],'Joined to Entra')==='Joined to Entra';
      const profile=select('window',t('Browser','Navegador'),[['Profile signed in','Perfil con sesión iniciada'],['Private window','Ventana privada']],'Profile signed in')==='Profile signed in';
      const sso=joined&&profile;
      body+=box('cloudap',40,40,250,'CloudAP · LSA',joined?t('Holds the PRT + session key','Guarda el PRT + session key'):t('No PRT on this device','Sin PRT en este dispositivo'),t('Inside the Local Security Authority. Its Entra plugin turns Windows sign-in into a PRT, keeps it with the session key and builds a PRT cookie when the browser asks for one.','Dentro de la Local Security Authority. Su plugin de Entra convierte el inicio de sesión de Windows en un PRT, lo guarda con la session key y arma una PRT cookie cuando el navegador la pide.'),joined?C.green:C.orange);
      body+=box('entra',470,40,250,'Microsoft Entra ID','Devices, /authorize, /token',t('Issues the PRT to a joined device, accepts a PRT cookie at /authorize, and issues the app\'s code and tokens as usual.','Emite el PRT a un dispositivo unido, acepta una PRT cookie en /authorize y emite el code y los tokens de la app como siempre.'));
      body+=box('tpm',40,190,250,'TPM',t('Private keys, wrapped session key','Claves privadas, session key envuelta'),t('Keeps the private device and transport keys. No other component can use the session key it wraps.','Guarda las claves privadas del dispositivo y de transporte. Ningún otro componente puede usar la session key que envuelve.'));
      body+=box('browser',470,190,250,t('Browser + MSAL','Navegador + MSAL'),profile?t('Profile signed in','Perfil con sesión iniciada'):t('Private window','Ventana privada'),t('The browser adds a PRT cookie and Entra\'s session cookie to the navigation. MSAL keeps the app\'s tokens in the tab\'s sessionStorage.','El navegador agrega una PRT cookie y la cookie de sesión de Entra a la navegación. MSAL guarda los tokens de la app en el sessionStorage de la pestaña.'),profile?C.green:C.orange);
      body+=arrow(292,81,462,81)+text(377,70,t('PRT request','Pedido del PRT'),13,C.muted)+arrow(165,124,165,184)+arrow(595,184,595,128)+arrow(462,231,298,231)+text(380,222,t('PRT cookie?','¿PRT cookie?'),13,C.muted);
      body+=band(290,t('PRT in CloudAP\'s cache','PRT en la caché de CloudAP'),joined?t('PRESENT','PRESENTE'):t('NONE','NINGUNO'),joined);
      if(moment==='Windows sign-in') {
        body+=band(345,t('Windows sign-in reaches Entra','El inicio de sesión de Windows llega a Entra'),joined?t('PRT ISSUED','PRT EMITIDO'):t('LOCAL ONLY','SOLO LOCAL'),joined);
        result=joined?t('PRT issued · CloudAP keeps it, the TPM protects its session key','PRT emitido · CloudAP lo guarda, el TPM protege su session key'):t('No Entra identity · Windows sign-in obtains no PRT','Sin identidad de Entra · el inicio de sesión no obtiene un PRT');
      } else if(moment==='Open the app') {
        body+=band(345,t('Password request at /authorize','Pedido de contraseña en /authorize'),sso?t('NONE','NINGUNO'):t('ASKED','SE PIDE'),sso);
        result=sso?t('No password · a PRT cookie signed Alice in; code and tokens follow as usual','Sin contraseña · la PRT cookie inició la sesión; siguen code y tokens'):joined?t('Credentials asked · private windows do not use the PRT','Se piden credenciales · las ventanas privadas no usan el PRT'):t('Credentials asked, unless Entra\'s session cookie is still valid','Se piden credenciales, salvo que siga válida la cookie de sesión de Entra');
      } else {
        body+=band(345,t('SPA refresh token, 24 hours','Refresh token de la SPA, 24 horas'),sso?t('RENEWED BY REDIRECT','SE RENUEVA CON UN REDIRECT'):t('SIGN IN AGAIN','NUEVO INICIO DE SESIÓN'),sso);
        result=sso?t('Refresh token expired · the redirect completes without a password','Refresh token vencido · el redirect se completa sin contraseña'):t('Refresh token expired · Alice signs in again, unless a session remains','Refresh token vencido · Alice inicia sesión de nuevo, salvo sesión vigente');
      }
      detail=t('The model illustrates where credentials live. It contacts no device, browser or tenant.','El modelo ilustra dónde viven las credenciales. No contacta ningún dispositivo, navegador ni tenant.');
    } else throw new Error('Unknown visual: '+kind);
    body+=`<rect x="25" y="412" width="710" height="92" rx="12" fill="${C.panel}"/>`+text(380,447,result,17,C.ink)+text(380,478,detail,12,C.muted);
    return {svg:`<svg viewBox="0 0 760 530" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="${esc(kind+' '+t('illustrative model','modelo ilustrativo'))}"><defs><marker id="arrow-${theme}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${C.green}"/></marker></defs><g font-family="Segoe UI,system-ui,sans-serif">${body}</g></svg>`,details,controls};
  }
  return {render,palette};
})();
