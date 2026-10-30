import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from './env';
import * as schema from './schema';

const sqlite = new Database(env.DB_FILE);
sqlite.pragma('journal_mode = WAL');
// Criação inicial das tabelas. Para evoluir o schema com segurança, adote drizzle-kit (migrations versionadas).
sqlite.exec(`
CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, html TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, modality TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot ON appointments (date, time);
`);

export const db = drizzle({ client: sqlite, schema });
