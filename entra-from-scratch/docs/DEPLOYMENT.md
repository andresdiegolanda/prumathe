# Deployment

## Static course

Build with `node scripts/build.mjs`, verify with `node scripts/check.mjs`, and serve only `dist/`. It contains the homepage, orientation, lessons, assets, notes, lab ZIP, 404 page and headers. Relative links allow a subdirectory deployment and a local file copy. There are no CDN scripts, remote fonts, telemetry or automatic network calls. The repository-level site builder includes this course under `entra-from-scratch/`.

`_headers` expresses a restrictive static-course CSP. A host that does not read that file must apply equivalent headers itself. The fallback 404 page has no dependent assets or relative navigation assumptions. Files under downloads should be delivered as attachments.

## Application lab

The application lab is separate from the static course. Never publish the fixture issuer or the local Compose credentials. The kit's HTTP transport and localhost URLs are deliberate development settings. The tenant route can be run locally without deploying it publicly.

For a real deployment, replace development origins with exact HTTPS destinations, configure the registered SPA redirect URI, preserve the MSAL redirect bridge route and its header requirements, protect the API and database transport, supply database credentials through the deployment's secret mechanism, and use separate migration/runtime identities. Test the actual deployed callback, API audience, CORS and database grants.

The static course CSP blocks outbound connections and is not an application CSP template. The application needs an explicit policy allowing its own API and the required identity endpoints. If a BFF/session architecture is adopted, revisit CSRF and session controls; the bearer-only sample's CSRF choice cannot be copied without that review.

No public application deployment is part of this release. Local tests are not production acceptance. The tenant workbook, threat model and operational evidence must be completed for the environment actually used.
