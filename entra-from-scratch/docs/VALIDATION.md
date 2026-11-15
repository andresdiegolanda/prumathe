# Validation record

Release 1.4.0. Validation date: 29 October 2026; the big picture of 1.1.0 and release 1.2.0 were validated on 14 November 2026, releases 1.2.1, 1.3.0 and 1.4.0 on 15 November 2026.

## Release 1.4.0

What changed: every zone of the big picture has a card, like a piece. A click on its name or on its empty space, or Enter when it has the focus, opens it in the panel: what it is, what it does not do, what is inside, lessons and the journeys that cross it. A drag that starts on a zone still moves the scene and opens nothing. The ten zones have text in both languages; the Microsoft Entra ID zone explains what a tenant is. A piece card links to its zone, `?zone=` opens a card, Esc goes back as for a piece, and the text version lists the zones. The card is an optional field of the shared engine, validated like the rest of the data; the engine goes identical to the six courses.

- `node scripts/check.mjs`: as in 1.3.0; the engine now also validates, for every zone with a card, both texts in both languages and its lessons. The other five courses pass their own checks with the new engine.
- Browser pass in Chromium under the course CSP: the ten zone cards opened by a click on empty space, in both languages at 1440x900 (Classic), 1366x768 (Dark), 390x844 (Classic), 1920x1080 (Projector) and in Reading, with the URL, the selected zone and the card checked each time; a drag starting on a zone opens nothing; Enter opens a focused zone; links from a piece to its zone, from a zone to an inner zone and back, and from a zone to a journey work; no console error. No zone card overflows the panel at 1440, 1366, 1024, 390 and 1920 px in either language; the panel text now wraps a long URL.
- Big picture: every stop of every journey walked with the keyboard in both languages at the four sizes, 132 stops each, with no problem and no console error; every label inside its box under the four skins in both languages.
- The definition of a tenant was checked on 15 November 2026 against Microsoft Learn, Microsoft Entra fundamentals: a dedicated and trusted instance of Microsoft Entra ID that generally represents a single organization or security boundary, with its users, groups, devices and applications.
- NOT EXECUTED: the tenant workbook, as in 1.3.0.

## Release 1.3.0

What changed: the course is in English and Rioplatense Spanish, with the same content and structure. EN and ES in the header choose the language. Both languages cover the 25 lessons with their scenes, questions and activities, the 9 model families with their controls, the glossary, the orientation page, the big picture, the downloadable notes (`downloads/course-notes-en.txt` and `downloads/course-notes-es.txt`) and the documents of the kit (`labs/README.md`, `labs/TENANT.md`, `labs/TENANT-EVIDENCE.txt`, `labs/CAPSTONE.md` and `labs/WORKSHEET.txt`, both languages in the same file). The kit code and its output, the Angular application and the maintainer documents stay in English. The English text is unchanged: the English notes differ from 1.2.1 only in the version line. Below 1000 px wide, the course name wraps and the lesson tabs scroll sideways, so the header no longer overflows the page; at 390 px it already did in 1.2.1, cutting the lesson on the right.

- `node scripts/check.mjs`: every text of the curriculum, the orientation page and the glossary has a non-empty English and Spanish version; every model state renders under four palettes in both languages; the notes of each language name every lesson; the rest as in 1.2.1. The engine validates both languages of the big picture.
- Browser pass in Chromium under the course CSP: the home page, the orientation page and the four views of every lesson (204 pages) in both languages at 1440x900, 1366x768, 1920x1080, 820x1180, 761x900, 390x844 and 360x740, with no page error, no element reaching past the viewport, no broken value and no English sentence left in the Spanish pages. Every text of every model measured inside its box in both languages, for every single-control variation (408 renders).
- Big picture: every stop of every journey walked with the keyboard in both languages at 1440x900 (Classic), 1366x768 (Dark), 390x844 (Classic) and 1920x1080 (Projector), 132 stops each, with no problem and no console error; every label inside its box under the four skins in both languages.
- Spanish names of Entra admin center screens, checked on 15 November 2026 against Microsoft Learn in Spanish (quickstarts to register an application and to expose a web API, app roles, assigning users and groups to an enterprise application, registering an application for Microsoft Graph). Names given consistently are shown in parentheses on first appearance. Application (client) ID, Directory (tenant) ID, Application ID URI, Accounts in this organizational directory only and Manifest stay in English only, because that documentation translates them in different ways or does not name them; `labs/TENANT.md` says so.
- NOT EXECUTED: the tenant workbook in either language, section F included.
- Observed during the pass, unchanged by this release: on every lesson page, the sidebar progress bar sets an inline style that the course CSP (`style-src 'self'`) refuses, and the browser logs it as a console error.

## Release 1.2.1

What changed: the Windows sign-in is a piece of its own on the scene ("Windows sign-in", LogonUI and LSA), where Alice's line arrives before CloudAP; the TPM moves out of the Windows zone, beside the browser, as hardware of the computer. The three Windows journeys come first: L, M and N of 1.2.0 are now A, B and C, and the earlier A to K are now D to N, with every cross reference between journeys and the activity of lesson 10 updated.

- `node scripts/check.mjs`: big picture with 28 pieces, 36 lines, 13 tokens, keys and cookies, 14 journeys and 132 stops; the rest as in 1.2.0.
- Browser pass in Chromium under the course CSP: every stop of every journey walked with the keyboard at 1440x900 (Classic), 1366x768 (Dark), 390x844 (Classic) and 1920x1080 (Projector), 132 stops each, with no problem and no console error; every label inside its box under the four skins, zone labels clear of lines and pieces. Scale and text sizes as in 1.2.0.
- Tenant workbook section F: still NOT EXECUTED.

## Release 1.2.0

What changed: lesson 10, "Windows sign-in and the Primary Refresh Token", in unit 2 after "Angular and MSAL". Later lessons move one number; progress is stored by lesson slug, so no recorded progress moves to another lesson. The tenant workbook gains section F, an optional sign-in from a Windows device joined to the tenant, and the evidence sheet three optional lines; the former section F is now G. The big picture gains Windows (CloudAP and the TPM), the browser itself and Entra's device record, five tokens, keys and cookies (device keys, PRT, session key, PRT cookie, Entra session cookie), three journeys (L, M and N), and for every token, key and cookie an ordered list of where it is, moment by moment. That list is an optional field of the shared engine, validated like the rest of the data.

- `node scripts/check.mjs`: 25 lessons, 75 scenes, 75 questions, 102 activity steps, 51 glossary entries, every model state, the new Windows sign-in model included, under four palettes. Big picture: 27 pieces, 35 lines, 13 tokens, keys and cookies, 14 journeys and 131 stops; ids, geometry, texts, lessons, lab commands (`dsregcmd /status` is accepted because the lesson prints it) and that each journey moves only along lines.
- Browser pass in Chromium under the course CSP from `_headers`: every stop of every journey walked with the keyboard at 1440x900 (Classic), 1366x768 (Dark), 390x844 (Classic) and 1920x1080 (Projector), 131 stops each, with no problem and no console error. Every label measured inside its box under the four skins; zone labels clear of lines and pieces. The scene grew from 1226 by 672 to 1296 by 762; at 1440x900 it is drawn at 0.786, piece names at 11.8 px and subtitles at 9.4 px. Token cards, the catalog of tokens, keys and cookies, and "Where they live" checked by screenshot.
- Lesson 10 rendered at 1440x900, 1366x768, 390x844, 1920x1080 and in Reading without horizontal overflow; every text of the Windows sign-in model measured inside its box for all control states.
- The lesson's claims were checked on 14 November 2026 against Microsoft Learn: the Primary Refresh Token concept page, dsregcmd troubleshooting, Microsoft Edge identity support, MSAL.js token lifetimes and prompt behavior, and third-party cookie blocking in SPAs.
- NOT EXECUTED: tenant workbook section F. No Windows device joined to a practice tenant was used, so the dsregcmd lines, the account picker without a password request and the credential request in an InPrivate window remain to be observed.
- Observed during the pass, unchanged by this release: on every lesson page, the sidebar progress bar sets an inline style that the course CSP (`style-src 'self'`) refuses, and the browser logs it as a console error.

## Big picture (1.1.0)

- `node scripts/check.mjs` validates the data with the engine: 23 pieces, 29 lines, 8 tokens and keys, 11 journeys and 101 stops; ids, geometry, texts, lessons, lab commands and that each journey moves only along lines.
- Browser pass in Chromium under the course CSP from `_headers`: every stop of every journey walked with the keyboard at 1440x900 (Classic), 1366x768 (Dark), 390x844 (Classic) and 1920x1080 (Projector). In each: the panel names the stop, the current piece is marked, the bubble stays inside the scene and never covers the current piece, no console error or warning, no horizontal overflow.
- Every label of the scene measured inside its box; zone labels clear of lines and pieces; legend text inside the legend. At 1440x900 the scene is drawn at 0.83: piece names at 12.4 px, subtitles at 10 px.
- Dialogs (tokens and keys, legend, text version, how to use), piece and token cards, "Where they live", deep links (`?j=B&s=7`, `?piece=decoder`, `?item=A`) and Reading checked by screenshot.
- The big picture runs no lab and calls no service. Its claims come from the lessons and the kit source; tags mark which stops the kit executes.

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
