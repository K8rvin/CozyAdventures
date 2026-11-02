import { randomUUID } from 'node:crypto';

function clone(value) {
  return value == null ? value : structuredClone(value);
}

export class MemoryStore {
  constructor() {
    this.users = new Map();
    this.credentials = new Map();
    this.sessions = new Map();
    this.cloudSaves = new Map();
    this.entitlements = new Map();
  }

  async registerUser(email, passwordHash) {
    if (this.credentials.has(email)) return null;
    const now = new Date().toISOString();
    const user = { id: randomUUID(), email, createdAt: now };
    this.users.set(user.id, user);
    this.credentials.set(email, {
      userId: user.id,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });
    return clone(user);
  }

  async getUserByEmail(email) {
    const credential = this.credentials.get(email);
    const user = credential ? this.users.get(credential.userId) : null;
    return user ? clone({ ...user, passwordHash: credential.passwordHash }) : null;
  }

  async updateUserPassword(userId, passwordHash) {
    const user = this.users.get(userId);
    const credential = user ? this.credentials.get(user.email) : null;
    if (!credential) return false;
    credential.passwordHash = passwordHash;
    credential.updatedAt = new Date().toISOString();
    return true;
  }

  async createSession(userId, tokenHash, expiresAt) {
    this.sessions.set(tokenHash, {
      userId,
      tokenHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
    });
  }

  async getSessionUser(tokenHash) {
    const session = this.sessions.get(tokenHash);
    if (!session) return null;
    if (Date.parse(session.expiresAt) <= Date.now()) {
      this.sessions.delete(tokenHash);
      return null;
    }
    return clone(this.users.get(session.userId) || null);
  }

  async revokeSession(tokenHash) {
    this.sessions.delete(tokenHash);
  }

  async revokeAllSessions(userId) {
    for (const [tokenHash, session] of this.sessions) {
      if (session.userId === userId) this.sessions.delete(tokenHash);
    }
  }

  async getEntitlement(userId, key) {
    const value = this.entitlements.get(`${userId}:${key}`);
    return value ? clone(value) : { active: false, grantedAt: null };
  }

  async grantEntitlement(userId, key) {
    const entitlementKey = `${userId}:${key}`;
    if (!this.entitlements.has(entitlementKey)) {
      this.entitlements.set(entitlementKey, { active: true, grantedAt: new Date().toISOString() });
    }
    return clone(this.entitlements.get(entitlementKey));
  }

  async getCloudSave(userId) {
    return clone(this.cloudSaves.get(userId) || null);
  }

  async putCloudSave(userId, input) {
    const current = this.cloudSaves.get(userId) || null;
    if ((!current && input.baseRevision !== 0)
      || (current && input.baseRevision !== current.revision)) {
      return { ok: false, save: clone(current) };
    }
    const save = {
      userId,
      state: clone(input.state),
      generation: input.generation,
      revision: current ? current.revision + 1 : 1,
      schemaVersion: 1,
      deviceId: input.deviceId,
      updatedAt: new Date().toISOString(),
    };
    this.cloudSaves.set(userId, save);
    return { ok: true, save: clone(save) };
  }

  async close() {}
}

export function createMemoryStore() {
  return new MemoryStore();
}
