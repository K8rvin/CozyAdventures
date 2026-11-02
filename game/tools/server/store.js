import { createMemoryStore } from './memoryStore.js';

export async function createAccountStore(options) {
  if (options.store) return { store: options.store, owned: false };
  if (options.databaseUrl) {
    const { createPostgresStore } = await import('./postgresStore.js');
    return { store: await createPostgresStore(options), owned: true };
  }
  return { store: createMemoryStore(), owned: true };
}
