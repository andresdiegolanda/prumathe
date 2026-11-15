# Teaching and editing

## Teaching contract

Teach the decision before the syntax. Every lesson has three scenes, three questions with plausible misconceptions, an interactive model and a guided activity. Every scene names a limit. The capstone requires a request trace, explicit policies, positive and negative evidence, and residual risks. The learner's progress is a declaration stored by lesson slug; it does not certify an executed lab.

The course is in English and Rioplatense Spanish, with the same content and structure; Spanish uses voseo. Technical terms stay in English as they are used in practice (token, scope, tenant, refresh token, PRT) and are explained the first time they appear; claims, values and tool output stay exactly as they are. Screens and options of the Entra admin center keep their English name; on its first appearance in a piece, the Spanish name used by Microsoft's Spanish documentation follows in parentheses, only when that documentation names it consistently. `labs/TENANT.md` lists the names that could not be verified. Recurring choices: purchase request is "solicitud de compra", an HTTP request is "pedido", capstone is "trabajo final", the big picture is "Panorama" and fixture stays as it is. The kit code and its output, the Angular application and these maintainer documents stay in English.

Introduce authentication, authorization, principal and resource before scopes and app roles. Keep user identity, client identity and database identity separate. Use tid plus oid for the course's identity key. Do not use a readable name as an authorization key.

The local kit is intentionally a resource-server experiment, not an identity-provider emulator. The fixture does not implement sign-in, code exchange, consent or refresh. The tenant workbook supplies those observations separately. Never describe the hash exercise as a completed PKCE flow or a decoded token as a validated token.

## Sources of truth

- `assets/curriculum.js`: version, review date, pinned baseline, units, lesson slugs, scenes, questions and activity commands. Every text is `{ en, es }`; a plain string reads the same in both languages, and `check.mjs` requires both.
- `assets/reference.js`: primary sources and glossary. Glossary relations are declared by slug and resolved for the presentation shell.
- `assets/about.js`: orientation, historical milestones with primary sources, scope and design judgments.
- `assets/visuals.js`: deterministic models with selectable objects and controls, under all four palettes.
- `assets/app.js`: the established course navigation, models, dialogs, reading view and progress.
- `assets/big-picture-data.js`: the big picture: zones and pieces with coordinates, a card for every zone (what it is, what it does not do, lessons), lines, tokens, keys and cookies with where each one is, moment by moment, and journeys whose stops name a piece, what the dot carries, a lesson, an optional lab command and how to observe it (KIT, TENANT, WINDOWS or MODEL). `assets/big-picture.js` and `assets/big-picture.css` draw it; the same engine serves every course and is not edited per course.
- `labs/`: runnable application, fixture tests, tenant workbook and worksheets.
- `scripts/build.mjs`: generated pages, notes and lab archive. `scripts/check.mjs` checks the contract and packaging.

Versions duplicated in package.json, the frontend package/lock files, pom.xml and compose.yaml are controlled by the static checker. The Docker runtime uses the Java 21 feature line; concrete image digests from validation belong in VALIDATION. Future patch rebuilds must be rechecked.

The course has seven units with stable slugs. A lesson insertion must not transfer progress to a different lesson. The shell retains Classic, Dark, Reading and Projector in both languages; EN and ES choose the language, which is kept in the browser and in the URL. Reading uses one scrolling document. The public course never calls localhost; the application is opened separately.

## The big picture

The big picture is the course seen from 10,000 feet: every piece on one scene, and journeys that follow one request or one decision stop by stop. A stop states what is decided at that piece, in one or two sentences, and points to the lesson that explains it. The tag says how a learner can observe the stop: KIT in the local lab, TENANT with a real tenant, WINDOWS on a device joined to that tenant, MODEL only in the lessons. A stop never claims more evidence than its tag.

A journey moves only along lines of the scene; `via` lists pieces the dot crosses without stopping, such as an answer returning through the filter chain. `check.mjs` runs the engine's own validation: unique ids, every piece inside its zone and apart from the others, no line crossing a piece, every text present, every lesson and lab command real, and every consecutive pair of stops joined by a line. The browser pass measures every label inside its box at the size it is drawn.

To add a journey, write its stops first as plain sentences, check each against the course, then place it. To move a piece, change its coordinates and rerun the checker; it reports overlaps and lines that cross pieces.

## Evidence and review

Static checks cannot validate token security. The lab checks actual HTTP statuses and SQL results. The RLS test deliberately removes an application WHERE predicate while using the runtime role. The pool test checks the same database connection after COMMIT. The race checks the persisted row and both competing responses. The tenant evidence sheet starts unexecuted.

After editing a lab, run its scenario and relevant negative neighbor. After changing token validation, run the complete suite. Execute activity commands from the curriculum in order when reviewing a release. Check every expected observation against output. No estimated study duration is published without measurement.

Before publication, review each conceptual claim against its primary reference and review the application contract against source. Watch for these common mistakes: replacing default validators, mixing audience and client ID, silently choosing a cached account, trusting browser ownership, using a privileged database role, leaking context across the pool, and promising immediate revocation.

The course does not include a new discussion integration or live observation service. Its application shows the real API response, while the diagrams remain explicitly illustrative. A production extension requires a separate design and evidence plan.
