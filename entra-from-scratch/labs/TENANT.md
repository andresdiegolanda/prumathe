# Real Entra tenant workbook / Recorrido con un tenant real de Entra

This route needs a practice **workforce tenant**, two practice users and the administrative permissions required by your organization's registration, consent and assignment policies. It changes your local lab configuration and asks you to make explicit changes in that practice tenant. Keep the local fixture route available as an account-free alternative. A local PASS is not evidence that any step below occurred.

Este recorrido necesita un **tenant workforce** de práctica, dos usuarios de práctica y los permisos de administración que exijan las políticas de registro, consentimiento y asignación de tu organización. Cambia la configuración de tu lab local y te pide hacer cambios explícitos en ese tenant de práctica. Mantené a mano el recorrido del fixture local como alternativa sin cuenta. Un PASS local no es evidencia de que haya pasado ninguno de los pasos de abajo.

The intended contract is a single tenant, a public Angular SPA and a separate purchase API. The SPA has no secret. The API is a resource server; validating incoming tokens does not require creating an API client secret either. A future confidential outbound client would be a separate responsibility.

El contrato previsto es un solo tenant, una SPA Angular pública y una API de compras aparte. La SPA no tiene secreto. La API es un resource server; validar los tokens que le llegan tampoco exige crear un client secret para la API. Un futuro cliente confidencial para llamar hacia afuera sería otra responsabilidad.

Las pantallas y las opciones del Entra admin center se nombran en inglés, tal como aparecen con el portal en inglés. La primera vez, entre paréntesis, va el nombre que usa la documentación de Microsoft en español. Sin verificar: Accounts in this organizational directory only, Application (client) ID, Directory (tenant) ID, Application ID URI y Manifest no llevan paréntesis, porque la documentación en español los traduce de formas distintas o no los nombra.

## A. Register the API resource / A. Registrá el recurso de la API

1. Register an application named `Prumathe Purchase API` with Accounts in this organizational directory only. Record its **Application (client) ID** as `API_CLIENT_ID` and Directory (tenant) ID as `TENANT_ID`. Do not substitute the Object ID.

   Registrá una aplicación llamada `Prumathe Purchase API` con Accounts in this organizational directory only. Anotá su **Application (client) ID** como `API_CLIENT_ID` y el Directory (tenant) ID como `TENANT_ID`. No pongas el Object ID (Id. de objeto) en su lugar.

2. In Expose an API, use `api://API_CLIENT_ID` as the Application ID URI, substituting the actual UUID. Add enabled delegated scopes with values `Requests.Read` and `Requests.Approve`. Give consent descriptions that explain the practice data and operations. Choose the consent setting allowed by your tenant policy; administrator consent may be necessary.

   En Expose an API (Exponer una API), usá `api://API_CLIENT_ID` como Application ID URI, con el UUID real en lugar del nombre. Agregá scopes delegados habilitados con los valores `Requests.Read` y `Requests.Approve`. Escribí descripciones de consentimiento que expliquen los datos y las operaciones de práctica. Elegí la opción de consentimiento que permita la política de tu tenant; puede hacer falta el consentimiento de un administrador.

3. In the API manifest, set `api.requestedAccessTokenVersion` to `2`. Preserve other settings. This sample validates the v2 issuer and expects the API client ID as `aud`.

   En el Manifest de la API, poné `api.requestedAccessTokenVersion` en `2`. Conservá las demás opciones. Este ejemplo valida el issuer v2 y espera el client ID de la API como `aud`.

4. Add an enabled app role with value `Approver` and allowed member type **Users/Groups** (the manifest value is `User`). Give it a description such as "Approve another person's pending practice purchase request." This is a user role, not an application permission for a daemon.

   Agregá un app role habilitado con el valor `Approver` y el tipo de miembro permitido **Users/Groups** (en el manifest, el valor es `User`). Dale una descripción como "Approve another person's pending practice purchase request." Es un rol de usuario, no un permiso de aplicación para un daemon.

Expected evidence: the API exposes the two scope values and the user role. Creating the registration did not deploy any Java code.

Evidencia esperada: la API expone los dos valores de scope y el rol de usuario. Crear el registro no desplegó ningún código Java.

## B. Register the SPA / B. Registrá la SPA

1. Register `Prumathe Purchase SPA` as single tenant. Record its Application (client) ID as `SPA_CLIENT_ID`.

   Registrá `Prumathe Purchase SPA` como de un solo tenant. Anotá su Application (client) ID como `SPA_CLIENT_ID`.

2. Add the **Single-page application** platform with the exact redirect URI `http://localhost:18094/redirect`. The `/redirect` path runs the MSAL v5 bridge, without bootstrapping the application. Do not configure a Web redirect for this browser flow. Do not enable the legacy implicit grant to make the example work.

   Agregá la plataforma **Single-page application** (Aplicación de página única) con la redirect URI exacta `http://localhost:18094/redirect`. La ruta `/redirect` ejecuta el bridge de MSAL v5, sin arrancar la aplicación. No configures un redirect Web para este flujo de navegador. No habilites el implicit grant heredado para que el ejemplo funcione.

3. In API permissions, select your API under My APIs and add both delegated scopes. Grant the consent your tenant requires. Remove unused default permissions if the registration introduced any; this sample does not call Microsoft Graph.

   En API permissions (Permisos de API), elegí tu API en My APIs (Mis API) y agregá los dos scopes delegados. Otorgá el consentimiento que exija tu tenant. Si el registro agregó permisos por defecto que no se usan, quitalos; este ejemplo no llama a Microsoft Graph.

4. Do not create a SPA secret. The client and tenant IDs are public configuration, not credentials.

   No crees un secreto para la SPA. El client ID y el tenant ID son configuración pública, no credenciales.

Expected evidence: the SPA requests permissions on the purchase API. It is not requesting a Graph token for this operation.

Evidencia esperada: la SPA pide permisos sobre la API de compras. No pide un token de Graph para esta operación.

## C. Assign the user role / C. Asigná el rol de usuario

1. In **Enterprise applications**, open the service principal corresponding to **Prumathe Purchase API**.

   En **Enterprise applications** (Aplicaciones empresariales), abrí el service principal que corresponde a **Prumathe Purchase API**.

2. Under Users and groups, assign the practice user Alice to the `Approver` role. Keep Bob without that role for the negative case. If your tenant requires app assignment, ensure both practice users can access the relevant apps under that policy; do not relax organizational policy to bypass a denial.

   En Users and groups (Usuarios y grupos), asignale a Alice, la usuaria de práctica, el rol `Approver`. Dejá a Bob sin ese rol para el caso negativo. Si tu tenant exige asignar las apps, asegurate de que los dos usuarios de práctica puedan acceder a las apps que corresponden según esa política; no aflojes la política de la organización para saltear un rechazo.

3. From each user's directory record in this resource tenant, record the user Object ID as `ALICE_OID` and `BOB_OID`. They must be distinct. For a guest, use the object in this tenant.

   Del registro de cada usuario en el directorio de este tenant del recurso, anotá el Object ID del usuario como `ALICE_OID` y `BOB_OID`. Tienen que ser distintos. Para un invitado, usá el objeto de este tenant.

Expected evidence: the role assignment belongs to the API's Enterprise application. A role assigned only to the SPA could appear in a client sign-in result without satisfying the API token contract.

Evidencia esperada: la asignación del rol pertenece a la entrada de la API en Enterprise applications. Un rol asignado solo a la SPA podría aparecer en el resultado del inicio de sesión del cliente sin cumplir el contrato de token de la API.

## D. Configure the local application / D. Configurá la aplicación local

Keep the Compose stack running. From labs, replace the five words below with the actual UUIDs, preserving the order:

Dejá corriendo el stack de Compose. Desde labs, reemplazá las cinco palabras de abajo por los UUIDs reales, en el mismo orden:

```text
node configure.mjs entra TENANT_ID SPA_CLIENT_ID API_CLIENT_ID ALICE_OID BOB_OID
docker compose up -d --force-recreate api
```

The helper validates UUID syntax, updates the local `.env` and frontend `config.json`, and assigns **only invented rows 41 and 42** to the supplied practice users in the supplied tenant. It resets these rows to PENDING. It never calls an Entra administration API. Review its source before use.

El ayudante valida la sintaxis de los UUIDs, actualiza el `.env` local y el `config.json` del frontend, y les asigna **solo las filas inventadas 41 y 42** a los usuarios de práctica indicados, en el tenant indicado. Vuelve a poner esas filas en PENDING. Nunca llama a una API de administración de Entra. Revisá su código antes de usarlo.

Restart or reload the Angular application at `http://localhost:18094`. It should report Microsoft Entra mode. `/health` must also report `authMode: entra`. A mode mismatch stops the client. The API now discovers keys from `https://login.microsoftonline.com/TENANT_ID/v2.0`; it does not trust the fixture signing key.

Reiniciá o recargá la aplicación Angular en `http://localhost:18094`. Tendría que informar el modo Microsoft Entra. `/health` también tiene que informar `authMode: entra`. Si los modos no coinciden, el cliente se detiene. Ahora la API descubre las claves a partir de `https://login.microsoftonline.com/TENANT_ID/v2.0`; no confía en la clave de firma del fixture.

The development server serves `/redirect` through the app entry point, whose early branch calls `broadcastResponseToMainFrame`. A deployed host must preserve this path and the MSAL bridge's header requirements. Do not carry the static course site's restrictive `connect-src 'none'` policy into the application: the course and the application are separate artifacts.

El servidor de desarrollo sirve `/redirect` a través del punto de entrada de la app, cuya rama temprana llama a `broadcastResponseToMainFrame`. Un host desplegado tiene que conservar esta ruta y los requisitos de headers del bridge de MSAL. No lleves a la aplicación la política restrictiva `connect-src 'none'` del sitio estático del curso: el curso y la aplicación son artefactos distintos.

## E. Observe a real request / E. Observá un pedido real

1. Sign in as Alice using the application button. Observe the Entra destination, the registered callback and the return to the app. Do not collect passwords, export token-bearing network archives or paste credentials into a decoder site.

   Iniciá sesión como Alice con el botón de la aplicación. Observá el destino en Entra, el callback registrado y la vuelta a la app. No juntes contraseñas, no exportes archivos de red que contengan tokens y no pegues credenciales en un sitio de decodificación.

2. Read 41: expect 200 and Alice's invented description. Read 42: expect 404 because this read endpoint is owner-only, even for Approver.

   Leé la 41: esperá 200 y la descripción inventada de Alice. Leé la 42: esperá 404, porque este endpoint de lectura es solo para el dueño, incluso con Approver.

3. Approve 41: expect 404 because self-approval is forbidden. Approve 42: expect 200 and APPROVED. Repeating it gives 404 because it is no longer pending.

   Aprobá la 41: esperá 404, porque está prohibido aprobar lo propio. Aprobá la 42: esperá 200 y APPROVED. Repetirlo da 404, porque ya no está pendiente.

4. Sign out and sign in as Bob. Read 42: expect 200 with APPROVED. Approve 41: expect 403 because Bob lacks Approver.

   Cerrá sesión e iniciá sesión como Bob. Leé la 42: esperá 200 con APPROVED. Aprobá la 41: esperá 403, porque Bob no tiene Approver.

5. Present a fixture token to the Entra-mode API using your own controlled HTTP client: expect 401. Do not copy a real token to the fixture service. The automated fixture suite intentionally refuses to run in this mode.

   Presentale un token del fixture a la API en modo Entra con un cliente HTTP propio y controlado: esperá 401. No copies un token real al servicio del fixture. La suite automática del fixture se niega, a propósito, a correr en este modo.

For step 5, this account-free credential test is available without displaying a token:

Para el paso 5 está disponible esta prueba de credenciales sin cuenta, que no muestra ningún token:

```text
node tenant-probe.mjs
```

Expected evidence: tenant-issued requests satisfy the allowed paths and fail the denied paths. The fixture credential remains rejected. Write observations in `TENANT-EVIDENCE.txt` with no raw token values.

Evidencia esperada: los pedidos con tokens emitidos por el tenant pasan por los caminos permitidos y fallan en los rechazados. La credencial del fixture sigue rechazada. Anotá las observaciones en `TENANT-EVIDENCE.txt`, sin valores de tokens crudos.

## F. Optional: sign in from a Windows device joined to the tenant / F. Opcional: iniciá sesión desde un dispositivo Windows unido al tenant

This section needs a Windows 10 or 11 device, a virtual machine is enough, joined to your practice tenant (Microsoft Entra joined or hybrid joined), with Alice signed in to Windows. Joining a device is outside this workbook: follow your tenant's process. Step 1 also works on any device joined to an Entra tenant; steps 2 and 3 need the practice tenant, because the SPA registration is single tenant.

Esta sección necesita un dispositivo Windows 10 u 11 (alcanza con una máquina virtual) unido a tu tenant de práctica (Microsoft Entra joined o hybrid joined), con Alice con la sesión de Windows iniciada. Unir un dispositivo queda fuera de este recorrido: seguí el proceso de tu tenant. El paso 1 también funciona en cualquier dispositivo unido a un tenant de Entra; los pasos 2 y 3 necesitan el tenant de práctica, porque el registro de la SPA es de un solo tenant.

1. Open a terminal as the signed-in user, not as administrator, and run:

   Abrí una terminal como el usuario con la sesión iniciada, no como administrador, y ejecutá:

```text
dsregcmd /status
```

Read three lines: `AzureAdJoined : YES` under Device State, `AzureAdPrt : YES` under SSO State and `TpmProtected` under Device Details. `AzureAdPrtUpdateTime` says when the Primary Refresh Token (PRT) was last renewed. Do not copy or share the output: it names the device, the tenant and the user.

Leé tres líneas: `AzureAdJoined : YES` en Device State, `AzureAdPrt : YES` en SSO State y `TpmProtected` en Device Details. `AzureAdPrtUpdateTime` dice cuándo se renovó por última vez el Primary Refresh Token (PRT). No copies ni compartas la salida: nombra el dispositivo, el tenant y el usuario.

2. Open Microsoft Edge with a profile signed in as Alice. In Chrome, the Microsoft Single Sign On extension plays that role.

   Abrí Microsoft Edge con un perfil que tenga iniciada la sesión de Alice. En Chrome, ese papel lo cumple la extensión Microsoft Single Sign On.

3. With the local application in Entra mode (section D), open `http://localhost:18094` and choose Sign in. The app asks Entra for `prompt=select_account`, so Entra shows its account picker; choose Alice's account. Expect no password request. Repeat in an InPrivate window: expect a credential request, because private windows do not use the PRT.

   Con la aplicación local en modo Entra (sección D), abrí `http://localhost:18094` y elegí Sign in. La app le pide a Entra `prompt=select_account`, así que Entra muestra su selector de cuentas; elegí la cuenta de Alice. No esperes ningún pedido de contraseña. Repetilo en una ventana InPrivate: esperá un pedido de credenciales, porque las ventanas privadas no usan el PRT.

Expected evidence: a PRT on the device, sign-in to the app without a password in the signed-in profile, and a credential request in the private window. Conditional Access in your tenant may still ask for more; record what you observed, not what you expected. The API receives the same thing either way: an access token for its audience. Write observations in `TENANT-EVIDENCE.txt`, without device, tenant or user identifiers.

Evidencia esperada: un PRT en el dispositivo, el inicio de sesión en la app sin contraseña en el perfil con la sesión iniciada, y un pedido de credenciales en la ventana privada. El Conditional Access de tu tenant igual puede pedir algo más; anotá lo que observaste, no lo que esperabas. La API recibe lo mismo en los dos casos: un access token para su audiencia. Anotá las observaciones en `TENANT-EVIDENCE.txt`, sin identificadores del dispositivo, del tenant ni del usuario.

## G. Diagnose, then clean up / G. Diagnosticá, después limpiá

If sign-in fails, inspect tenant registration and the exact redirect URI. If token acquisition fails, inspect requested resource/scopes and consent. If the API returns 401, inspect its expected issuer, audience, tenant, token version and allowed SPA ID. If approval returns 403, inspect scope and API role assignment. If a read returns 404, inspect the invented row's validated tenant and object IDs. Never remove a check merely to obtain 200.

Si falla el inicio de sesión, inspeccioná el registro en el tenant y la redirect URI exacta. Si falla la obtención del token, inspeccioná el recurso y los scopes pedidos, y el consentimiento. Si la API devuelve 401, inspeccioná el issuer, la audiencia, el tenant, la versión de token y el ID de la SPA permitido que espera. Si la aprobación devuelve 403, inspeccioná el scope y la asignación del rol de la API. Si una lectura devuelve 404, inspeccioná el tenant y los object IDs validados de la fila inventada. Nunca quites una verificación solo para obtener un 200.

Changes to assignments may require fresh token acquisition before you can observe them. The sample does not promise immediate role revocation or implement CAE. Tenant consent, MFA and Conditional Access behavior are observed only if your tenant actually exercises them.

Los cambios de asignaciones pueden necesitar que se obtenga un token nuevo antes de que puedas observarlos. El ejemplo no promete la revocación inmediata de roles ni implementa CAE. El comportamiento del consentimiento, de MFA y del Conditional Access del tenant se observa solo si tu tenant de verdad los aplica.

Restore local fixture mode when finished: / Cuando termines, restaurá el modo fixture local:

```text
node configure.mjs fixture
docker compose up -d --force-recreate api
```

Reload Angular. Review and remove the practice registrations and assignments according to your tenant's process when no longer needed. The local helper does not perform cloud cleanup.

Recargá Angular. Cuando ya no los necesites, revisá y quitá los registros y las asignaciones de práctica según el proceso de tu tenant. El ayudante local no limpia nada en la nube.

## Account-free case / Caso sin cuenta

Assume tenant T, SPA S, API A, Alice object X and Bob object Y. The API expects issuer T/v2.0, audience A and client S. Token 1 has audience S; Token 2 has audience A, Requests.Read and subject X; Token 3 adds Requests.Approve and Approver. Row 41 is (T,X,PENDING), row 42 is (T,Y,PENDING).

Suponé el tenant T, la SPA S, la API A, el objeto X de Alice y el objeto Y de Bob. La API espera el issuer T/v2.0, la audiencia A y el cliente S. El token 1 tiene la audiencia S; el token 2 tiene la audiencia A, Requests.Read y el sujeto X; el token 3 suma Requests.Approve y Approver. La fila 41 es (T,X,PENDING) y la fila 42 es (T,Y,PENDING).

Explain: why Token 1 is rejected; why Token 2 reads 41 but not 42; why Token 3 can approve 42 but not 41; why repeating the approval fails; and why this reasoning does not prove any tenant issued those claims.

Explicá: por qué se rechaza el token 1; por qué el token 2 lee la 41 pero no la 42; por qué el token 3 puede aprobar la 42 pero no la 41; por qué falla repetir la aprobación; y por qué este razonamiento no prueba que algún tenant haya emitido esos claims.

## Primary references / Fuentes primarias

- [SPA configuration](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-configuration)
- [App roles](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps)
- [Permissions and consent](https://learn.microsoft.com/en-us/entra/identity-platform/permissions-consent-overview)
- [Access tokens and token version](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens)
- [MSAL redirect bridge](https://learn.microsoft.com/en-us/entra/msal/javascript/browser/redirect-bridge)
- [Primary Refresh Token](https://learn.microsoft.com/en-us/entra/identity/devices/concept-primary-refresh-token)
- [Troubleshoot devices with dsregcmd](https://learn.microsoft.com/en-us/entra/identity/devices/troubleshoot-device-dsregcmd)
- [Microsoft Edge identity support](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-security-identity)
