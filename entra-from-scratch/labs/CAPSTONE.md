# Capstone: defend one request

Deliver a request diagram, separate read/approve policies, a prediction table, observed local results, a separate tenant evidence sheet and a residual-risk note. Use invented data and sanitized output only.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| Principals and recipients | Conflates users and services | Names components | Names every principal, credential, recipient and trust decision |
| Token contract | Relies on decoding or any signature | Checks some claims | Explains trusted issuer/key, audience, time, tenant, subject and permitted client |
| Operation policy | Sign-in grants access | Uses scope or role alone | Distinguishes delegated scope, app role and caller type |
| Object policy | Trusts an ID or caller-supplied owner | Filters one route | Explains tenant, owner, state, RLS role and every data path |
| Transactions | Ignores pools or races | Names one risk | Explains context lifetime, atomic update and external-effect limit |
| Evidence | Shows only PASS | Shows allowed and denied results | Connects predictions to observations and detects a removed-control regression |
| Limits | Claims production certification | Lists generic cautions | Separates tenant evidence and specifies unverified operational dependencies |

A strong submission scores at least 12/14, with no zero for token, operation or object policy. This is a course rubric, not a security certification.

Required negative cases: wrong audience, forged signature, expired token, missing scope, missing role, wrong owner, wrong tenant, app-only caller and competing approvals. Explain why a valid signature cannot compensate for a wrong audience, and why Approver cannot compensate for self-approval.

Extension: add a nightly workload or downstream Graph request on paper. Specify the grant, recipient, permission vocabulary, audit principal and tests. Do not weaken the user endpoint merely to reuse it.

Production review: explain TLS at both network boundaries, secret custody, dependency maintenance, safe telemetry, tenant onboarding, role-removal latency, key discovery failures and the effect of a compromised frontend or API. State an owner and an evidence requirement for each unresolved item.
