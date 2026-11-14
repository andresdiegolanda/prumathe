-- The database of the origin of Rumbo: shipments and the movements the carriers report.
CREATE TABLE shipments (
  id TEXT PRIMARY KEY,
  destination TEXT NOT NULL,
  status TEXT NOT NULL,
  updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The event id of the carrier is the primary key: a movement delivered twice is stored once.
CREATE TABLE movements (
  event_id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL REFERENCES shipments(id),
  status TEXT NOT NULL,
  received TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO shipments (id, destination, status, updated) VALUES
  ('R-1042', 'Montevideo', 'in transit', '2026-11-14T08:00:00Z'),
  ('R-1043', 'Madrid', 'delivered', '2026-11-13T16:20:00Z'),
  ('R-1044', 'Dublin', 'at the depot', '2026-11-14T07:10:00Z');
