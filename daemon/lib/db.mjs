import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

export function initDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      type TEXT NOT NULL,
      actor TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'success',
      duration_ms INTEGER,
      metadata TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_activity_actor ON activity(actor);
  `);
  return db;
}

const insertStmt = new WeakMap();

export function logActivity(db, entry) {
  if (!insertStmt.has(db)) {
    insertStmt.set(
      db,
      db.prepare(`
        INSERT INTO activity (type, actor, description, status, duration_ms, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
    );
  }
  const info = insertStmt.get(db).run(
    entry.type,
    entry.actor,
    entry.description,
    entry.status ?? "success",
    entry.duration_ms ?? null,
    entry.metadata ? JSON.stringify(entry.metadata) : null
  );
  return info.lastInsertRowid;
}

export function updateActivityStatus(db, id, status, durationMs) {
  db.prepare("UPDATE activity SET status = ?, duration_ms = ? WHERE id = ?").run(
    status,
    durationMs ?? null,
    id
  );
}

export function recoverCrashedEntries(db) {
  const info = db.prepare(
    "UPDATE activity SET status = 'crashed' WHERE status = 'running'"
  ).run();
  return info.changes;
}

export function getLastRun(db, actor) {
  const row = db
    .prepare(
      "SELECT timestamp FROM activity WHERE actor = ? AND type = 'routine_run' ORDER BY timestamp DESC LIMIT 1"
    )
    .get(actor);
  return row?.timestamp ?? null;
}
