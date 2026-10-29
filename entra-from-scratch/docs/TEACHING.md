# Teaching and editing

## Teaching contract

Teach the decision before the syntax. Every lesson has three scenes, three questions with plausible misconceptions, an interactive model and a guided activity. Every scene names a limit. The capstone requires a request trace, explicit policies, positive and negative evidence, and residual risks. The learner's progress is a declaration stored by lesson slug; it does not certify an executed lab.

English is the sole language of this course. Introduce authentication, authorization, principal and resource before scopes and app roles. Keep user identity, client identity and database identity separate. Use tid plus oid for the course's identity key. Do not use a readable name as an authorization key.

The local kit is intentionally a resource-server experiment, not an identity-provider emulator. The fixture does not implement sign-in, code exchange, consent or refresh. The tenant workbook supplies those observations separately. Never describe the hash exercise as a completed PKCE flow or a decoded token as a validated token.

## Sources of truth

- `assets/curriculum.js`: version, review date, pinned baseline, units, lesson slugs, scenes, questions and activity commands.
- `assets/reference.js`: primary sources and glossary. Glossary relations are declared by slug and resolved for the presentation shell.
- `assets/about.js`: orientation, historical milestones with primary sources, scope and design judgments.
- `assets/visuals.js`: deterministic models with selectable objects and controls, under all four palettes.
- `assets/app.js`: the established course navigation, models, dialogs, reading view and progress.
- `labs/`: runnable application, fixture tests, tenant workbook and worksheets.
- `scripts/build.mjs`: generated pages, notes and lab archive. `scripts/check.mjs` checks the contract and packaging.

Versions duplicated in package.json, the frontend package/lock files, pom.xml and compose.yaml are controlled by the static checker. The Docker runtime uses the Java 21 feature line; concrete image digests from validation belong in VALIDATION. Future patch rebuilds must be rechecked.

The course has seven units with stable slugs. A lesson insertion must not transfer progress to a different lesson. The English shell retains Classic, Dark, Reading and Projector. Reading uses one scrolling document. The public course never calls localhost; the application is opened separately.

## Evidence and review

Static checks cannot validate token security. The lab checks actual HTTP statuses and SQL results. The RLS test deliberately removes an application WHERE predicate while using the runtime role. The pool test checks the same database connection after COMMIT. The race checks the persisted row and both competing responses. The tenant evidence sheet starts unexecuted.

After editing a lab, run its scenario and relevant negative neighbor. After changing token validation, run the complete suite. Execute activity commands from the curriculum in order when reviewing a release. Check every expected observation against output. No estimated study duration is published without measurement.

Before publication, review each conceptual claim against its primary reference and review the application contract against source. Watch for these common mistakes: replacing default validators, mixing audience and client ID, silently choosing a cached account, trusting browser ownership, using a privileged database role, leaking context across the pool, and promising immediate revocation.

The course does not include a new discussion integration or live observation service. Its application shows the real API response, while the diagrams remain explicitly illustrative. A production extension requires a separate design and evidence plan.
