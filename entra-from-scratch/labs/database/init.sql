-- Local demonstration credentials. This database is never published on a host port.
CREATE ROLE app_runtime LOGIN PASSWORD 'local-runtime-only' NOSUPERUSER NOBYPASSRLS;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
CREATE TABLE purchase_request (
  id bigint PRIMARY KEY,
  tenant_id uuid NOT NULL,
  owner_oid uuid NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING', 'APPROVED'))
);
INSERT INTO purchase_request VALUES
  (41, '11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Alice: field recorder', 'PENDING'),
  (42, '11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Bob: reference books', 'PENDING'),
  (43, '99999999-9999-4999-8999-999999999999', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Other tenant: private request', 'PENDING');
GRANT SELECT, UPDATE(status) ON purchase_request TO app_runtime;
ALTER TABLE purchase_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_request FORCE ROW LEVEL SECURITY;
CREATE POLICY request_boundary ON purchase_request TO app_runtime
  USING (
    tenant_id = NULLIF(current_setting('app.tenant', true), '')::uuid
    AND (owner_oid = NULLIF(current_setting('app.subject', true), '')::uuid
         OR current_setting('app.approver', true) = 'true')
  )
  WITH CHECK (
    tenant_id = NULLIF(current_setting('app.tenant', true), '')::uuid
    AND current_setting('app.approver', true) = 'true'
  );
