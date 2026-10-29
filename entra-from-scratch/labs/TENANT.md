# Real Entra tenant workbook

This route needs a practice **workforce tenant**, two practice users and the administrative permissions required by your organization's registration, consent and assignment policies. It changes your local lab configuration and asks you to make explicit changes in that practice tenant. Keep the local fixture route available as an account-free alternative. A local PASS is not evidence that any step below occurred.

The intended contract is a single tenant, a public Angular SPA and a separate purchase API. The SPA has no secret. The API is a resource server; validating incoming tokens does not require creating an API client secret either. A future confidential outbound client would be a separate responsibility.

## A. Register the API resource

1. Register an application named `Prumathe Purchase API` with Accounts in this organizational directory only. Record its **Application (client) ID** as `API_CLIENT_ID` and Directory (tenant) ID as `TENANT_ID`. Do not substitute the Object ID.
2. In Expose an API, use `api://API_CLIENT_ID` as the Application ID URI, substituting the actual UUID. Add enabled delegated scopes with values `Requests.Read` and `Requests.Approve`. Give consent descriptions that explain the practice data and operations. Choose the consent setting allowed by your tenant policy; administrator consent may be necessary.
3. In the API manifest, set `api.requestedAccessTokenVersion` to `2`. Preserve other settings. This sample validates the v2 issuer and expects the API client ID as `aud`.
4. Add an enabled app role with value `Approver` and allowed member type **Users/Groups** (the manifest value is `User`). Give it a description such as "Approve another person's pending practice purchase request." This is a user role, not an application permission for a daemon.

Expected evidence: the API exposes the two scope values and the user role. Creating the registration did not deploy any Java code.

## B. Register the SPA

1. Register `Prumathe Purchase SPA` as single tenant. Record its Application (client) ID as `SPA_CLIENT_ID`.
2. Add the **Single-page application** platform with the exact redirect URI `http://localhost:18094/redirect`. The `/redirect` path runs the MSAL v5 bridge, without bootstrapping the application. Do not configure a Web redirect for this browser flow. Do not enable the legacy implicit grant to make the example work.
3. In API permissions, select your API under My APIs and add both delegated scopes. Grant the consent your tenant requires. Remove unused default permissions if the registration introduced any; this sample does not call Microsoft Graph.
4. Do not create a SPA secret. The client and tenant IDs are public configuration, not credentials.

Expected evidence: the SPA requests permissions on the purchase API. It is not requesting a Graph token for this operation.

## C. Assign the user role

1. In **Enterprise applications**, open the service principal corresponding to **Prumathe Purchase API**.
2. Under Users and groups, assign the practice user Alice to the `Approver` role. Keep Bob without that role for the negative case. If your tenant requires app assignment, ensure both practice users can access the relevant apps under that policy; do not relax organizational policy to bypass a denial.
3. From each user's directory record in this resource tenant, record the user Object ID as `ALICE_OID` and `BOB_OID`. They must be distinct. For a guest, use the object in this tenant.

Expected evidence: the role assignment belongs to the API's Enterprise application. A role assigned only to the SPA could appear in a client sign-in result without satisfying the API token contract.

## D. Configure the local application

Keep the Compose stack running. From labs, replace the five words below with the actual UUIDs, preserving the order:

```text
node configure.mjs entra TENANT_ID SPA_CLIENT_ID API_CLIENT_ID ALICE_OID BOB_OID
docker compose up -d --force-recreate api
```

The helper validates UUID syntax, updates the local `.env` and frontend `config.json`, and assigns **only invented rows 41 and 42** to the supplied practice users in the supplied tenant. It resets these rows to PENDING. It never calls an Entra administration API. Review its source before use.

Restart or reload the Angular application at `http://localhost:18094`. It should report Microsoft Entra mode. `/health` must also report `authMode: entra`. A mode mismatch stops the client. The API now discovers keys from `https://login.microsoftonline.com/TENANT_ID/v2.0`; it does not trust the fixture signing key.

The development server serves `/redirect` through the app entry point, whose early branch calls `broadcastResponseToMainFrame`. A deployed host must preserve this path and the MSAL bridge's header requirements. Do not carry the static course site's restrictive `connect-src 'none'` policy into the application: the course and the application are separate artifacts.

## E. Observe a real request

1. Sign in as Alice using the application button. Observe the Entra destination, the registered callback and the return to the app. Do not collect passwords, export token-bearing network archives or paste credentials into a decoder site.
2. Read 41: expect 200 and Alice's invented description. Read 42: expect 404 because this read endpoint is owner-only, even for Approver.
3. Approve 41: expect 404 because self-approval is forbidden. Approve 42: expect 200 and APPROVED. Repeating it gives 404 because it is no longer pending.
4. Sign out and sign in as Bob. Read 42: expect 200 with APPROVED. Approve 41: expect 403 because Bob lacks Approver.
5. Present a fixture token to the Entra-mode API using your own controlled HTTP client: expect 401. Do not copy a real token to the fixture service. The automated fixture suite intentionally refuses to run in this mode.

For step 5, this account-free credential test is available without displaying a token:

```text
node tenant-probe.mjs
```

Expected evidence: tenant-issued requests satisfy the allowed paths and fail the denied paths. The fixture credential remains rejected. Write observations in `TENANT-EVIDENCE.txt` with no raw token values.

## F. Diagnose, then clean up

If sign-in fails, inspect tenant registration and the exact redirect URI. If token acquisition fails, inspect requested resource/scopes and consent. If the API returns 401, inspect its expected issuer, audience, tenant, token version and allowed SPA ID. If approval returns 403, inspect scope and API role assignment. If a read returns 404, inspect the invented row's validated tenant and object IDs. Never remove a check merely to obtain 200.

Changes to assignments may require fresh token acquisition before you can observe them. The sample does not promise immediate role revocation or implement CAE. Tenant consent, MFA and Conditional Access behavior are observed only if your tenant actually exercises them.

Restore local fixture mode when finished:

```text
node configure.mjs fixture
docker compose up -d --force-recreate api
```

Reload Angular. Review and remove the practice registrations and assignments according to your tenant's process when no longer needed. The local helper does not perform cloud cleanup.

## Account-free case

Assume tenant T, SPA S, API A, Alice object X and Bob object Y. The API expects issuer T/v2.0, audience A and client S. Token 1 has audience S; Token 2 has audience A, Requests.Read and subject X; Token 3 adds Requests.Approve and Approver. Row 41 is (T,X,PENDING), row 42 is (T,Y,PENDING).

Explain: why Token 1 is rejected; why Token 2 reads 41 but not 42; why Token 3 can approve 42 but not 41; why repeating the approval fails; and why this reasoning does not prove any tenant issued those claims.

## Primary references

- [SPA configuration](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-configuration)
- [App roles](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps)
- [Permissions and consent](https://learn.microsoft.com/en-us/entra/identity-platform/permissions-consent-overview)
- [Access tokens and token version](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens)
- [MSAL redirect bridge](https://learn.microsoft.com/en-us/entra/msal/javascript/browser/redirect-bridge)
