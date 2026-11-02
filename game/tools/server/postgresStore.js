import { randomUUID } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIGRATIONS_DIR = fileURLToPath(new URL('./migrations', import.meta.url));
const MIGRATION_LOCK = 184731029;

function mapUser(row, includePasswordHash = false) {
  return row ? {
    id: row.id,
    email: row.email,
    createdAt: new Date(row.created_at).toISOString(),
    ...(includePasswordHash ? { passwordHash: row.password_hash } : {}),
  } : null;
}

function mapEntitlement(row) {
  return row
    ? { active: row.active, grantedAt: new Date(row.granted_at).toISOString() }
    : { active: false, grantedAt: null };
}

function mapSave(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    state: row.state,
    generation: row.generation,
    revision: Number(row.revision),
    schemaVersion: row.schema_version,
    deviceId: row.device_id,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export class PostgresStore {
  constructor(pool, ownsPool = true) {
    this.pool = pool;
    this.ownsPool = ownsPool;
  }

  async migrate() {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK]);
      await client.query(`
        CREATE TABLE IF NOT EXISTS knight_server_schema_migrations (
          name TEXT PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      const names = (await readdir(MIGRATIONS_DIR)).filter((name) => /^\d+.*\.sql$/.test(name)).sort();
      for (const name of names) {
        const applied = await client.query('SELECT 1 FROM knight_server_schema_migrations WHERE name = $1', [name]);
        if (applied.rowCount) continue;
        const sql = await readFile(join(MIGRATIONS_DIR, name), 'utf8');
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO knight_server_schema_migrations(name) VALUES ($1)', [name]);
          await client.query('COMMIT');
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      }
    } finally {
      await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK]).catch(() => {});
      client.release();
    }
  }

  async registerUser(email, passwordHash) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const insertedUser = await client.query('INSERT INTO users(id) VALUES ($1) RETURNING id, created_at', [randomUUID()]);
      const insertedCredential = await client.query(
        `INSERT INTO auth_credentials(user_id, email, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING email`,
        [insertedUser.rows[0].id, email, passwordHash],
      );
      if (!insertedCredential.rowCount) {
        await client.query('ROLLBACK');
        return null;
      }
      await client.query('COMMIT');
      return mapUser({ ...insertedUser.rows[0], email: insertedCredential.rows[0].email });
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email) {
    const result = await this.pool.query(
      `SELECT u.id, u.created_at, c.email, c.password_hash
       FROM auth_credentials c JOIN users u ON u.id = c.user_id
       WHERE c.email = $1`,
      [email],
    );
    return mapUser(result.rows[0], true);
  }

  async updateUserPassword(userId, passwordHash) {
    const result = await this.pool.query(
      'UPDATE auth_credentials SET password_hash = $2, updated_at = now() WHERE user_id = $1',
      [userId, passwordHash],
    );
    return result.rowCount === 1;
  }

  async createSession(userId, tokenHash, expiresAt) {
    await this.pool.query(
      'INSERT INTO sessions(token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
      [tokenHash, userId, new Date(expiresAt).toISOString()],
    );
  }

  async getSessionUser(tokenHash) {
    const result = await this.pool.query(
      `SELECT u.id, u.created_at, c.email
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       JOIN auth_credentials c ON c.user_id = u.id
       WHERE s.token_hash = $1 AND s.expires_at > now()`,
      [tokenHash],
    );
    return mapUser(result.rows[0]);
  }

  async revokeSession(tokenHash) {
    await this.pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
  }

  async revokeAllSessions(userId) {
    await this.pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
  }

  async getEntitlement(userId, key) {
    const result = await this.pool.query(
      'SELECT active, granted_at FROM entitlements WHERE user_id = $1 AND key = $2',
      [userId, key],
    );
    return mapEntitlement(result.rows[0]);
  }

  async grantEntitlement(userId, key) {
    const result = await this.pool.query(
      `INSERT INTO entitlements(user_id, key) VALUES ($1, $2)
       ON CONFLICT (user_id, key) DO UPDATE SET active = true
       RETURNING active, granted_at`,
      [userId, key],
    );
    return mapEntitlement(result.rows[0]);
  }

  async getCloudSave(userId) {
    const result = await this.pool.query('SELECT * FROM cloud_saves WHERE user_id = $1', [userId]);
    return mapSave(result.rows[0]);
  }

  async putCloudSave(userId, input) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`cloud-save:${userId}`]);
      const current = await client.query('SELECT * FROM cloud_saves WHERE user_id = $1 FOR UPDATE', [userId]);
      const existing = current.rows[0] || null;
      if (!existing && input.baseRevision !== 0) {
        await client.query('COMMIT');
        return { ok: false, save: null };
      }
      if (existing && input.baseRevision !== Number(existing.revision)) {
        await client.query('COMMIT');
        return { ok: false, save: mapSave(existing) };
      }
      let saved;
      if (!existing) {
        saved = await client.query(
          `INSERT INTO cloud_saves(user_id, generation, revision, schema_version, state, device_id)
           VALUES ($1, $2, 1, 1, $3::jsonb, $4) RETURNING *`,
          [userId, input.generation, JSON.stringify(input.state), input.deviceId],
        );
      } else {
        saved = await client.query(
          `UPDATE cloud_saves
           SET generation = $2, revision = revision + 1, schema_version = 1,
               state = $3::jsonb, device_id = $4, updated_at = now()
           WHERE user_id = $1 AND revision = $5
           RETURNING *`,
          [userId, input.generation, JSON.stringify(input.state), input.deviceId, input.baseRevision],
        );
      }
      if (!saved.rowCount) {
        await client.query('COMMIT');
        return { ok: false, save: mapSave(existing) };
      }
      await client.query('COMMIT');
      return { ok: true, save: mapSave(saved.rows[0]) };
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  async close() {
    if (this.ownsPool) await this.pool.end();
  }
}

export async function createPostgresStore(options) {
  const { default: pg } = await import('pg');
  const pool = options.pgPool || new pg.Pool({
    connectionString: options.databaseUrl,
    max: options.databasePoolSize || 10,
    ...(options.databaseSsl ? { ssl: options.databaseSsl } : {}),
  });
  const store = new PostgresStore(pool, !options.pgPool);
  await store.migrate();
  return store;
}
