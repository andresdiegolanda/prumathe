# Microsoft Entra: the application lab / Microsoft Entra: el laboratorio de la aplicación

One purchase request, three application layers, explicit trust boundaries. This kit is self-contained. Its documents are in English and in Rioplatense Spanish; the code and its output are in English.

Una solicitud de compra, tres capas de aplicación, límites de confianza explícitos. Este kit es autosuficiente. Sus documentos están en inglés y en español rioplatense; el código y su salida, en inglés.

## What the two routes establish / Qué establecen los dos recorridos

| Route / Recorrido | What runs / Qué se ejecuta | What it can establish / Qué puede establecer |
|---|---|---|
| Local fixture / Fixture local | Angular, Spring Security, PostgreSQL, a test-token dispenser / Angular, Spring Security, PostgreSQL y un emisor de tokens de prueba | Actual API validation, scope and role checks, row constraints and transaction behavior / La validación real de la API, las verificaciones de scope y de rol, las restricciones de filas y el comportamiento de las transacciones |
| Entra tenant / Tenant de Entra | The same app, configured for your practice tenant / La misma app, configurada para tu tenant de práctica | Actual registration, consent, sign-in, token issuance and role assignment observations / Observaciones reales de registro, consentimiento, inicio de sesión, emisión de tokens y asignación de roles |

The fixture is **not an identity provider or an Entra emulator**. Anyone reaching its local endpoint can obtain a test token. It has no password, MFA, consent, authorization-code endpoint or refresh flow. Never deploy it publicly. The local suite refuses Entra mode.

El fixture **no es un proveedor de identidad ni un emulador de Entra**. Cualquiera que llegue a su endpoint local puede obtener un token de prueba. No tiene contraseña, MFA, consentimiento, endpoint de authorization code ni flujo de renovación. Nunca lo despliegues en público. La suite local se niega a correr en modo Entra.

## Prerequisites and baseline / Requisitos y configuración base

- Node.js 24, npm and Docker with Linux containers and Compose v2. / Node.js 24, npm y Docker con contenedores Linux y Compose v2.
- Angular 21.2.25 (LTS), MSAL Browser 5.27.0, Spring Boot 4.1.2, Java 21 and PostgreSQL 18.6. / Angular 21.2.25 (LTS), MSAL Browser 5.27.0, Spring Boot 4.1.2, Java 21 y PostgreSQL 18.6.
- Network access for the first dependency/image download. The fixture route works locally after those downloads. / Acceso a la red para la primera descarga de dependencias e imágenes. Después de esas descargas, el recorrido del fixture funciona en local.
- For the tenant route, a workforce practice tenant, permission to register applications and consent as required by its policy, and two practice users. No tenant is needed for the local route. / Para el recorrido del tenant, un tenant workforce de práctica, permiso para registrar aplicaciones y dar el consentimiento que exija su política, y dos usuarios de práctica. El recorrido local no necesita ningún tenant.

The API compiles in its container. You do not need a host Java or Maven installation. The client uses MSAL Browser directly from an Angular service to keep the protocol calls visible; it does not use the MSAL Angular wrapper.

La API se compila en su contenedor. No hace falta tener Java ni Maven instalados en tu máquina. El cliente usa MSAL Browser directamente desde un servicio de Angular, para que las llamadas del protocolo queden a la vista; no usa el wrapper MSAL Angular.

## Start / Arrancar

Open a terminal in this `labs` folder: / Abrí una terminal en esta carpeta `labs`:

```text
node lab.mjs setup
docker compose up -d --build
```

The first build downloads dependencies and can take several minutes depending on the connection. Then open a second terminal in `labs/frontend`:

El primer build descarga dependencias y puede tardar varios minutos, según la conexión. Después abrí una segunda terminal en `labs/frontend`:

```text
npm ci
npm start
```

Open **http://localhost:18094**. Use that exact hostname: the development CORS policy allows `localhost`, and the Entra callback later uses it too. The page should say Local fixture mode and Ready. If the API is still starting, reload after its health endpoint reports up.

Abrí **http://localhost:18094**. Usá exactamente ese hostname: la política CORS de desarrollo permite `localhost`, y más adelante el callback de Entra también lo usa. La página tendría que decir Local fixture mode y Ready. Si la API todavía está arrancando, recargá cuando su endpoint de salud diga que está arriba.

| Service / Servicio | Address / Dirección | Exposure / Exposición |
|---|---|---|
| Angular | http://localhost:18094 | Local development server / Servidor de desarrollo local |
| Spring API / API Spring | http://127.0.0.1:18095/health | Loopback only / Solo loopback |
| Fixture issuer / Emisor del fixture | http://127.0.0.1:18096/health | Loopback only / Solo loopback |
| PostgreSQL | `db:5432` inside Compose / `db:5432` dentro de Compose | No host port / Sin puerto en el host |

The project name is `prumathe-entra`. It does not use another project's database, global configuration or identity. Local database passwords in compose and SQL are deliberately public practice values. Production needs different credentials, transport protection and deployment configuration. If certificate validation fails during a download, use your organization's approved trust configuration; do not disable certificate verification.

El proyecto se llama `prumathe-entra`. No usa la base de datos, la configuración global ni la identidad de otro proyecto. Las contraseñas locales de la base de datos en compose y en el SQL son, a propósito, valores públicos de práctica. Producción necesita otras credenciales, protección del transporte y otra configuración de despliegue. Si falla la validación de certificados durante una descarga, usá la configuración de confianza aprobada por tu organización; no deshabilites la verificación de certificados.

## Predict, send, explain / Predecí, mandá, explicá

Fixture rows: 41 belongs to Alice, 42 to Bob, 43 to another tenant. The `approver` token represents Alice with the Approver user role. All approved mutations are restricted to another owner's pending request in the same tenant. The read endpoint stays owner-only even for an approver.

Filas del fixture: la 41 es de Alice, la 42 es de Bob y la 43 es de otro tenant. El token `approver` representa a Alice con el rol de usuario Approver. Todos los cambios aprobados se limitan a la solicitud pendiente de otro dueño en el mismo tenant. El endpoint de lectura sigue siendo solo para el dueño, incluso para un aprobador.

```text
node lab.mjs boundary
node lab.mjs tokens
node lab.mjs audience
node lab.mjs signature
node lab.mjs time
node lab.mjs scopes
node lab.mjs roles
node lab.mjs delegation
node lab.mjs owner
node lab.mjs tenant
node lab.mjs subject
node lab.mjs database
node lab.mjs http
node lab.mjs rls
node lab.mjs pool
node lab.mjs atomic
node lab.mjs cors
node lab.mjs pkce
node lab.mjs matrix
node lab.mjs all
```

Each scenario prints its observation and fails if the expected status or database result differs. `all` runs 50 assertions and writes `runs/all.json`. It leaves the three services running. `atomic` resets only row 42 before its race and restores PENDING after successful assertions. Other scenarios are read-only apart from generating evidence and the first setup configuration. If you manually approve row 42 in the browser, `atomic` restores that practice state.

Cada escenario imprime su observación y falla si el código de estado o el resultado de la base de datos no es el esperado. `all` ejecuta 50 aserciones y escribe `runs/all.json`. Deja corriendo los tres servicios. `atomic` vuelve a poner en PENDING solo la fila 42 antes de su carrera, y la deja en PENDING otra vez después de las aserciones exitosas. Los demás escenarios solo leen, salvo por la evidencia que generan y la configuración inicial del setup. Si aprobás a mano la fila 42 en el navegador, `atomic` restaura ese estado de práctica.

The setup, PKCE hash and fixture claim inspection are narrow local observations. They do not establish an Entra protocol exchange. The remaining assertions execute HTTP or SQL against the actual services. SQL tests use an administrative connection only to switch explicitly to the runtime role or prepare the fixed fixture; the API always connects as `app_runtime`.

El setup, el hash de PKCE y la inspección de los claims del fixture son observaciones locales acotadas. No establecen un intercambio del protocolo de Entra. Las demás aserciones ejecutan HTTP o SQL contra los servicios reales. Las pruebas de SQL usan una conexión de administración solo para pasar de forma explícita al rol de ejecución o para preparar el fixture fijo; la API siempre se conecta como `app_runtime`.

## Read the mechanism / Leé el mecanismo

| File / Archivo | Responsibility / Responsabilidad |
|---|---|
| `frontend/src/main.ts` | Initialize MSAL, select the active account, acquire an API token, send it to the fixed API destination / Inicializar MSAL, elegir la cuenta activa, obtener un token para la API y mandarlo al destino fijo de la API |
| `api/src/main/java/course/entra/SecurityConfig.java` | Issuer, signature, time and claim validation; authority mapping; exact development CORS policy / Validación del issuer, la firma, el tiempo y los claims; conversión a authorities; política CORS de desarrollo exacta |
| `api/src/main/java/course/entra/Requests.java` | Scope and role requirements; transaction-local context; parameterized row rules; atomic approval / Requisitos de scope y de rol; contexto local de la transacción; reglas de filas parametrizadas; aprobación atómica |
| `database/init.sql` | Restricted runtime role, grants, invented rows and RLS policy / Rol de ejecución restringido, permisos, filas inventadas y política RLS |
| `fixture/issuer.mjs` | Local test credentials, including deliberately invalid variants / Credenciales locales de prueba, incluidas variantes inválidas a propósito |
| `TENANT.md` | Real registration and sign-in route, including sign-in from a Windows device joined to the tenant / Recorrido real de registro e inicio de sesión, incluido el inicio de sesión desde un dispositivo Windows unido al tenant |

Use `WORKSHEET.txt` after each activity. Use `CAPSTONE.md` for the final review. The standalone lesson notes explain the concepts without requiring command recall.

Usá `WORKSHEET.txt` después de cada actividad. Usá `CAPSTONE.md` para la revisión final. Los apuntes de las lecciones, que se leen por separado, explican los conceptos sin que tengas que recordar comandos.

## Stop, restart, restore the fixture / Detener, reiniciar, restaurar el fixture

Stop the Angular terminal with Ctrl+C, then run `docker compose stop` from labs. Restart containers with `docker compose start`. Nothing is deleted. To switch back from an Entra exercise and restore the two practice owners:

Detené la terminal de Angular con Ctrl+C y después ejecutá `docker compose stop` desde labs. Reiniciá los contenedores con `docker compose start`. No se borra nada. Para volver de un ejercicio de Entra y restaurar los dos dueños de práctica:

```text
node configure.mjs fixture
docker compose up -d --force-recreate api
```

Reload the frontend. To inspect startup failures use `docker compose logs --tail 60 api`. Do not publish logs containing real credentials. The lab never needs raw tokens in a bug report.

Recargá el frontend. Para inspeccionar fallas de arranque usá `docker compose logs --tail 60 api`. No publiques logs que contengan credenciales reales. El lab nunca necesita tokens crudos en un reporte de errores.

## Deliberate limits / Límites deliberados

Single tenant, one allowed SPA client, delegated user endpoints, one user role, read and approve only. No Graph call, OBO implementation, workload endpoint, production TLS, distributed revocation, CAE, production deployment or security certification is included. RLS trusts application-supplied transaction context and does not protect against a fully compromised API. HTTP on loopback and the isolated container network is a local teaching choice.

Un solo tenant, un solo cliente SPA permitido, endpoints delegados de usuario, un solo rol de usuario, y solo lectura y aprobación. No incluye ninguna llamada a Graph, implementación de OBO, endpoint para workloads, TLS de producción, revocación distribuida, CAE, despliegue de producción ni certificación de seguridad. RLS confía en el contexto de transacción que pone la aplicación y no protege contra una API comprometida por completo. HTTP sobre loopback y sobre la red aislada de los contenedores es una elección local, para enseñar.
