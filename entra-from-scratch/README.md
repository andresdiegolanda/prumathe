# Microsoft Entra from scratch

**Understand authentication and authorization by following one request through Angular, Spring and PostgreSQL.** Entirely in English.

Open [index.html](index.html) in a browser. Start with [What Microsoft Entra ID does](what-entra-is.html), then lesson 00. No server, account, external scripts or network connection is required for the course itself. The downloadable application lab declares its own dependencies.

- 24 lessons in 7 units, 72 scenes and 72 conceptual questions.
- 8 interactive model families: component boundaries, registration objects, PKCE, tokens, permission predicates, rows, database connections and token lifetime.
- 97 guided activity steps, 44 glossary terms, four display modes and browser-local progress.
- A complete Angular/MSAL client, Spring Security resource server and PostgreSQL database with explicit owner/tenant rules and RLS.
- 50 local assertions, including invalid tokens, scope/role failures, object isolation, pooled context and concurrent approval.
- A real Entra tenant workbook with an account-free case study, a separate evidence sheet and a capstone rubric.

The learning cycle is **predict, observe, explain, name the limit**. Commands are expandable references. Knowing why a valid token can still lead to a denied operation is a learning objective; memorizing a CLI flag is not.

## The application contract

One workforce tenant, one public SPA client and a separate API resource. A user can read their own purchase request. An approver with the delegated approval scope can approve somebody else's pending request in the same tenant. The API validates credentials, enforces scope and role, and constrains SQL. PostgreSQL authenticates a restricted application role and enforces a row policy using transaction-local context.

The local issuer is a **test-token dispenser**, not Entra or an OIDC emulator. Local tests establish the API and database behavior. They do not establish real sign-in, consent, MFA, Conditional Access, role propagation or CAE. Those distinctions are explicit throughout the course.

## Run and maintain

```text
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

Preview: http://127.0.0.1:4175. Build generates lesson shells, English notes, `downloads/entra-labs.zip` and the static `dist` folder. The kit excludes caches, dependency folders, local configuration and evidence. Follow [labs/README.md](labs/README.md) to start the application; use [docs/VALIDATION.md](docs/VALIDATION.md) to inspect the evidence and limits.

The local suite leaves its services running. Its concurrency case resets only practice row 42. Stop with `docker compose stop` from labs; stop Angular with Ctrl+C. Do not run fixture checks against a tenant exercise in progress.

Version 1.0.0. Sources reviewed 29 October 2026. Baseline: Angular 21.2.25, MSAL Browser 5.27.0, Spring Boot 4.1.2, Java 21, PostgreSQL 18.6, Node.js 24. Angular 21 is the selected LTS line; the course does not silently track latest. Dependency updates require a rebuild and renewed validation.

See [teaching and editing](docs/TEACHING.md), [deployment](docs/DEPLOYMENT.md), [validation](docs/VALIDATION.md) and the [MIT license](LICENSE).
