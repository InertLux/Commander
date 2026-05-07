#!/usr/bin/env bash
set -euo pipefail

DB_FILE="./mydatabase.sqlite"
SQL_TMP="$(mktemp)"
OWNER="$(id -un)"
GROUP="$(id -gn)"

cleanup() {
  rm -f "$SQL_TMP"
}
trap cleanup EXIT

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "Error: sqlite3 not found. Install sqlite first." >&2
  exit 1
fi

# SQL: create table if not exists, insert sample data, create index
cat > "$SQL_TMP" <<'SQL'
PRAGMA foreign_keys = ON;

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample rows only if table is empty
INSERT INTO users (username, email)
SELECT 'alice', 'alice@example.com'
WHERE NOT EXISTS (SELECT 1 FROM users);

INSERT INTO users (username, email)
SELECT 'bob', 'bob@example.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='bob');

COMMIT;
SQL

# Create DB directory if needed
mkdir -p "$(dirname "$DB_FILE")"

# Run SQL against the DB
sqlite3 "$DB_FILE" < "$SQL_TMP"

# Set secure file permissions (owner read/write)
chmod 600 "$DB_FILE" || true
chown "$OWNER:$GROUP" "$DB_FILE" || true

echo "Database created/updated at: $DB_FILE"
echo "Contents:"
sqlite3 "$DB_FILE" "SELECT id, username, email, created_at FROM users;"
