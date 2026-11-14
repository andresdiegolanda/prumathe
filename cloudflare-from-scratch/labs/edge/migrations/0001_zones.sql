-- D1: the rates of each zone, read at the edge so a quote does not reach the origin.
CREATE TABLE zones (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  days INTEGER NOT NULL,
  base_eur REAL NOT NULL,
  per_kg_eur REAL NOT NULL
);
INSERT INTO zones (code, name, days, base_eur, per_kg_eur) VALUES
  ('MVD', 'Montevideo', 1, 4.5, 0.8),
  ('BUE', 'Buenos Aires', 2, 7.9, 1.1),
  ('MAD', 'Madrid', 3, 12.0, 1.6),
  ('DUB', 'Dublin', 3, 11.5, 1.5);
