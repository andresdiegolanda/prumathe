# Microsoft Entra: the application lab

One purchase request, three application layers, explicit trust boundaries. This kit is in English and is self-contained.

## What the two routes establish

| Route | What runs | What it can establish |
|---|---|---|
| Local fixture | Angular, Spring Security, PostgreSQL, a test-token dispenser | Actual API validation, scope and role checks, row constraints and transaction behavior |
| Entra tenant | The same app, configured for your practice tenant | Actual registration, consent, sign-in, token issuance and role assignment observations |

The fixture is **not an identity provider or an Entra emulator**. Anyone reaching its local endpoint can obtain a test token. It has no password, MFA, consent, authorization-code endpoint or refresh flow. Never deploy it publicly. The local suite refuses Entra mode.

## Prerequisites and baseline

- Node.js 24, npm and Docker with Linux containers and Compose v2.
- Angular 21.2.25 (LTS), MSAL Browser 5.27.0, Spring Boot 4.1.2, Java 21 and PostgreSQL 18.6.
- Network access for the first dependency/image download. The fixture route works locally after those downloads.
- For the tenant route, a workforce practice tenant, permission to register applications and consent as required by its policy, and two practice users. No tenant is needed for the local route.

The API compiles in its container. You do not need a host Java or Maven installation. The client uses MSAL Browser directly from an Angular service to keep the protocol calls visible; it does not use the MSAL Angular wrapper.

## Start

Open a terminal in this `labs` folder:

```text
node lab.mjs setup
docker compose up -d --build
```

The first build downloads dependencies and can take several minutes depending on the connection. Then open a second terminal in `labs/frontend`:

```text
npm ci
npm start
```

Open **http://localhost:18094**. Use that exact hostname: the development CORS policy allows `localhost`, and the Entra callback later uses it too. The page should say Local fixture mode and Ready. If the API is still starting, reload after its health endpoint reports up.

| Service | Address | Exposure |
|---|---|---|
| Angular | http://localhost:18094 | Local development server |
| Spring API | http://127.0.0.1:18095/health | Loopback only |
| Fixture issuer | http://127.0.0.1:18096/health | Loopback only |
| PostgreSQL | `db:5432` inside Compose | No host port |

The project name is `prumathe-entra`. It does not use another project's database, global configuration or identity. Local database passwords in compose and SQL are deliberately public practice values. Production needs different credentials, transport protection and deployment configuration. If certificate validation fails during a download, use your organization's approved trust configuration; do not disable certificate verification.

## Predict, send, explain

Fixture rows: 41 belongs to Alice, 42 to Bob, 43 to another tenant. The `approver` token represents Alice with the Approver user role. All approved mutations are restricted to another owner's pending request in the same tenant. The read endpoint stays owner-only even for an approver.

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

The setup, PKCE hash and fixture claim inspection are narrow local observations. They do not establish an Entra protocol exchange. The remaining assertions execute HTTP or SQL against the actual services. SQL tests use an administrative connection only to switch explicitly to the runtime role or prepare the fixed fixture; the API always connects as `app_runtime`.

## Read the mechanism

| File | Responsibility |
|---|---|
| `frontend/src/main.ts` | Initialize MSAL, select the active account, acquire an API token, send it to the fixed API destination |
| `api/src/main/java/course/entra/SecurityConfig.java` | Issuer, signature, time and claim validation; authority mapping; exact development CORS policy |
| `api/src/main/java/course/entra/Requests.java` | Scope and role requirements; transaction-local context; parameterized row rules; atomic approval |
| `database/init.sql` | Restricted runtime role, grants, invented rows and RLS policy |
| `fixture/issuer.mjs` | Local test credentials, including deliberately invalid variants |
| `TENANT.md` | Real registration and sign-in route |

Use `WORKSHEET.txt` after each activity. Use `CAPSTONE.md` for the final review. The standalone lesson notes explain the concepts without requiring command recall.

## Stop, restart, restore the fixture

Stop the Angular terminal with Ctrl+C, then run `docker compose stop` from labs. Restart containers with `docker compose start`. Nothing is deleted. To switch back from an Entra exercise and restore the two practice owners:

```text
node configure.mjs fixture
docker compose up -d --force-recreate api
```

Reload the frontend. To inspect startup failures use `docker compose logs --tail 60 api`. Do not publish logs containing real credentials. The lab never needs raw tokens in a bug report.

## Deliberate limits

Single tenant, one allowed SPA client, delegated user endpoints, one user role, read and approve only. No Graph call, OBO implementation, workload endpoint, production TLS, distributed revocation, CAE, production deployment or security certification is included. RLS trusts application-supplied transaction context and does not protect against a fully compromised API. HTTP on loopback and the isolated container network is a local teaching choice.
