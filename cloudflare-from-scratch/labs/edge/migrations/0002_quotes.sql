-- Every quote the edge answers, to read back with SQL.
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone TEXT NOT NULL REFERENCES zones(code),
  kg REAL NOT NULL,
  total_eur REAL NOT NULL,
  created TEXT NOT NULL DEFAULT (datetime('now'))
);
