# Validation record

Release 1.0.0. Validation date: 29 October 2026.

## Executed evidence

- Windows 11, Node.js 24.11.0, Docker Engine 29.1.3 with Linux containers.
- Spring Boot 4.1.2 compiled inside Maven 3.9.11 / Java 21 build image.
- PostgreSQL 18.6 and the real Spring API started under the isolated `prumathe-entra` project.
- `node labs/lab.mjs all`: 50 assertions passed. Valid and invalid HTTP credentials, issuer, signature, audience, time, scope, role, tenant, subject, client, ownership, runtime database privileges, RLS without an application predicate, same-session context after COMMIT, alternating subjects, concurrent approval and CORS responses.
- The concurrent approval test observed exactly one 200 and one 404, verified APPROVED in PostgreSQL and restored row 42 to PENDING.
- Angular 21.2.25 with MSAL Browser 5.27.0 installed with a lockfile and compiled successfully. The redirect bridge import is included in the bundle. Compilation does not prove a real sign-in.
- `node scripts/test-activities.mjs`: the 22 scenario commands printed in the curriculum passed in order through Windows PowerShell. Manual and tenant activities are not included in that count.
- Static build and checker passed: 24 pages, 72 scenes, 72 questions, 97 activity steps, 44 glossary entries, all default/control model states under four palettes, syntax, encoding, version agreement and clean ZIP contents.
- All 24 lessons rendered under Classic, Dark, Reading and Projector at 1440x900 without horizontal overflow or JavaScript page errors. The homepage also rendered through a local file URL.
- Expanded checkpoint explanations and the final completion block remained reachable at 1440x900, 1366x620 and 390x844 in all four modes. Glossary search, empty results, keyboard object activation and Escape were exercised.
- The actual Angular client observed own-record read 200, other-owner read 404, wrong-audience token 401 and missing-role approval 403. These are browser requests to the real API, not model outputs.
- Runtime updated to Node.js 24.22.0 for the fixture and the full 50-assertion suite passed again. The API container reports Temurin 21.0.13+9. The host used to run build/test helpers remains Node.js 24.11.0.
- The downloaded kit was extracted into an empty folder; setup and the independent PKCE hash exercise passed from that copy. The local configuration restoration command and Compose configuration validation also passed.

Local evidence is written under ignored `labs/runs/`. The suite leaves the lab services running. It uses fixture credentials only and refuses Entra mode. Database authentication is local practice configuration; no production transport properties are claimed.

## Not executed

- Actual Entra registration, consent, sign-in, user-role assignment, callback exchange and tenant-issued API requests. No practice tenant was configured for this validation.
- Tenant-specific MFA, Conditional Access, CAE, role-removal latency, guest lifecycle or identity-provider/key-rotation outages.
- Production deployment, production TLS, managed database identity, OBO, Microsoft Graph or workload permissions.
- Usability or study-duration measurement with learners.

The tenant route provides `TENANT-EVIDENCE.txt` to record these observations separately. The account-free case remains a reasoning exercise.

## Source currency

Primary sources in `assets/reference.js` and `assets/about.js` were reviewed on the release date. Angular 21 is selected as an LTS baseline (published LTS end: June 2027). PostgreSQL 18 is supported through November 2030. Spring Boot 4.1 is the current selected minor line. MSAL Browser 5 uses a dedicated redirect bridge; the sample includes that requirement rather than relying on older callback behavior.

Versions are pinned as a reproducible teaching baseline, not a promise that every future rebuild is unchanged. The Node, Java and Maven images use feature/patch tags where shown; capture resolved image digests when reproducing validation. Update dependencies and rerun the evidence before treating a later build as equivalent.

The fixture Node, PostgreSQL and Maven build image references include these observed manifest digests:

| Image | Digest |
|---|---|
| Node 24.22.0 Alpine | `sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f` |
| PostgreSQL 18.6 Alpine | `sha256:10a5c69a83035ab5239f5620d708520e8b28f5aa1f2b20143e6024532edadfb5` |
| Maven 3.9.11 / Java 21 | `sha256:6fdc855a6ed81d288ca7ca37ac6ff5e9308b612485c0801d70b25a858c83d237` |

The Java runtime image remains the Java 21 feature-line tag; the observed runtime above identifies this validation. The source date is not a claim that a future mutable base-image rebuild has been executed.

Primary version references: [Angular releases](https://angular.dev/reference/releases), [Spring Boot](https://spring.io/projects/spring-boot/), [PostgreSQL support](https://www.postgresql.org/support/versioning/) and [Node 24.22.0 release](https://nodejs.org/en/blog/release/v24.22.0).
