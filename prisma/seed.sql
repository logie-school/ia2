-- init db for testing, use in db editor
CREATE TABLE IF NOT EXISTS role (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE
);

INSERT OR REPLACE INTO role (id, name) VALUES
  (1, 'principle'),
  (2, 'admin'),
  (3, 'hod'),
  (4, 'teacher'),
  (5, 'user');

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  created DATETIME NOT NULL
);

INSERT OR REPLACE INTO users (user_id, user_email, created) VALUES
  ('b9edfd59-a708-4cf1-8f5e-bc9a876cddee', 'archie@logie.lol', datetime(1747026885716 / 1000, 'unixepoch'));

CREATE TABLE IF NOT EXISTS auth (
  user_id TEXT PRIMARY KEY NOT NULL,
  pwd_hash TEXT NOT NULL,
  pwd_salt TEXT NOT NULL,
  last_updated DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT OR REPLACE INTO auth (user_id, pwd_hash, pwd_salt, last_updated) VALUES
  ('b9edfd59-a708-4cf1-8f5e-bc9a876cddee', '$2b$10$H/usBFGJD53zDV8jEBsVm.JOGQeg5xCoPZ7sbnDBv/pmffktl8Hz.', '$2b$10$H/usBFGJD53zDV8jEBsVm.', datetime(1747026885716 / 1000, 'unixepoch'));

CREATE TABLE IF NOT EXISTS staff (
  staff_email TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  fn TEXT NOT NULL,
  mn TEXT,
  sn TEXT NOT NULL,
  role_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT OR REPLACE INTO staff (staff_email, user_id, fn, mn, sn, role_id) VALUES
  ('archie@logie.lol', 'b9edfd59-a708-4cf1-8f5e-bc9a876cddee', 'Archie', NULL, 'Logie', 1);