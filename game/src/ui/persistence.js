import { createMinuteAutosave } from '../core/minuteAutosave.js';
import { serializeGameSave, deserializeGameSave, SAVE_MAX_BYTES } from '../core/saveFormat.js';
import { migrateGameState } from '../core/state.js';

const META_KEY = 'cozy_cloud_sync_v1';

function uuid() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function createPersistence(options) {
  const {
    account, storage = globalThis.localStorage, getState, replaceState,
    hadLocalSave = false, chooseConflict, confirmInitialUpload, onStatus,
  } = options;
  let meta = { deviceId: uuid(), generation: uuid(), userId: null, baseRevision: 0, pending: false, enabled: false, configured: false };
  try { meta = { ...meta, ...JSON.parse(storage?.getItem(META_KEY) || 'null') }; } catch { /* используем новое поколение */ }
  let autosave = null;
  let busy = null;
  let currentStatus = { status: meta.pending ? 'pending' : 'local', dirty: meta.pending, baseRevision: meta.baseRevision, lastSyncedAt: null };
  const listeners = new Set();
  const tabId = uuid();
  const channel = typeof globalThis.window?.BroadcastChannel === 'function'
    ? new globalThis.window.BroadcastChannel('cozy_cloud_sync_v1')
    : null;
  function conflictFromTab() {
    stopAutosave();
    emit({
      ...currentStatus, status: 'conflict', dirty: true,
      error: 'Другая вкладка изменила сохранение. Выберите актуальную версию перед продолжением.',
    });
  }
  if (channel) {
    channel.onmessage = (event) => {
      if (event.data?.tabId !== tabId) conflictFromTab();
    };
  }
  const onStorage = (event) => {
    if (event.key === 'cozy_adventures_save_v2' && event.newValue) conflictFromTab();
  };
  globalThis.window?.addEventListener?.('storage', onStorage);

  function saveMeta() {
    try { storage?.setItem(META_KEY, JSON.stringify(meta)); } catch { /* локальный сейв остаётся основным */ }
  }
  function snapshot() {
    return {
      ...currentStatus, enabled: meta.enabled && account.isSupporter(), configured: meta.configured,
      generation: meta.generation, deviceId: meta.deviceId, pending: meta.pending,
    };
  }
  function emit(status = currentStatus) {
    currentStatus = status;
    const value = snapshot();
    for (const listener of listeners) listener(value);
    onStatus?.(value);
  }
  function profileId() {
    const profile = account.snapshot().profile;
    return profile?.id || profile?.userId || profile?.user?.id || null;
  }
  function currentSnapshot() {
    return { generation: meta.generation, state: structuredClone(getState()) };
  }
  function stopAutosave() {
    autosave?.destroy();
    autosave = null;
  }
  function startAutosave() {
    stopAutosave();
    autosave = createMinuteAutosave({
      deviceId: meta.deviceId,
      initialBaseRevision: meta.baseRevision,
      isEnabled: () => meta.enabled && account.isSupporter(),
      getSnapshot: currentSnapshot,
      putSnapshot: (payload) => account.putCloudSave(payload),
      loadPending: () => meta.pending,
      savePending(value) { meta.pending = value; saveMeta(); },
      onConflict() {
        stopAutosave();
        emit({ ...currentStatus, status: 'conflict', dirty: true });
      },
      onStatus(status) {
        meta.baseRevision = status.baseRevision;
        meta.pending = status.dirty;
        saveMeta();
        emit(status);
      },
    });
    if (meta.enabled) autosave.start();
    const status = autosave.getStatus();
    emit(status.dirty ? status : { ...status, status: 'synced', lastSyncedAt: Date.now() });
  }
  function parseRemote(remote) {
    return deserializeGameSave(JSON.stringify({
      schemaVersion: remote.schemaVersion,
      generation: remote.generation,
      state: remote.state,
    }), { migrate: migrateGameState, maxBytes: SAVE_MAX_BYTES });
  }
  function acceptRemote(remote, parsed) {
    replaceState(parsed.state, { remote: true });
    meta.generation = parsed.generation;
    meta.baseRevision = remote.revision;
    meta.pending = false;
    saveMeta();
  }
  async function putLocal(baseRevision) {
    const response = await account.putCloudSave({
      ...currentSnapshot(), baseRevision, deviceId: meta.deviceId,
    });
    meta.baseRevision = response.revision;
    meta.pending = false;
    saveMeta();
    return response;
  }
  async function choose(remote, parsed) {
    const local = currentSnapshot();
    return chooseConflict({
      remote, remoteState: parsed.state, localState: local.state,
      sameGeneration: remote.generation === local.generation,
    });
  }

  function reconcile() {
    if (busy) return busy;
    busy = (async () => {
      if (!account.isSupporter() || !meta.enabled) {
        stopAutosave();
        emit({ ...currentStatus, status: 'local' });
        return null;
      }
      emit({ ...currentStatus, status: 'syncing' });
      let remote = null;
      try {
        remote = await account.getCloudSave();
      } catch (error) {
        if (error.status !== 404) {
          emit({ ...currentStatus, status: error.status ? 'error' : 'offline', dirty: meta.pending, error: error.message });
          throw error;
        }
      }
      const uid = profileId();
      let result = null;
      if (!remote) {
        if (meta.baseRevision > 0 && meta.userId === uid) {
          const choice = await chooseConflict({ remote: null, localState: getState(), reason: 'missing' });
          if (choice === 'wait') {
            emit({ ...currentStatus, status: 'conflict', dirty: true });
            return null;
          }
        }
        if (meta.baseRevision === 0 && meta.userId !== uid && confirmInitialUpload) {
          const allowed = await confirmInitialUpload({ localState: getState() });
          if (!allowed) {
            meta.enabled = false;
            saveMeta();
            emit({ ...currentStatus, status: 'local' });
            return null;
          }
        }
        result = await putLocal(0);
      } else {
        const parsed = parseRemote(remote);
        const firstDownload = !hadLocalSave && !meta.pending;
        const sameSave = meta.userId === uid && meta.generation === remote.generation;
        let action = 'keep';
        if (firstDownload) action = 'remote';
        else if (sameSave && !meta.pending && remote.revision > meta.baseRevision) action = 'remote';
        else if (sameSave && remote.revision === meta.baseRevision) action = meta.pending ? 'local' : 'keep';
        else if (!sameSave || remote.revision !== meta.baseRevision) {
          action = await choose(remote, parsed);
        }
        if (action === 'wait') {
          emit({ ...currentStatus, status: 'conflict', dirty: true });
          return null;
        }
        if (action === 'remote') acceptRemote(remote, parsed);
        else if (action === 'local') result = await putLocal(remote.revision);
        else meta.baseRevision = remote.revision;
        meta.pending = action === 'remote' ? false : meta.pending;
        saveMeta();
      }
      meta.userId = uid;
      if (result) meta.baseRevision = result.revision;
      saveMeta();
      startAutosave();
      return result || remote;
    })();
    busy.finally(() => { busy = null; }).catch(() => {});
    return busy;
  }

  return {
    notifyDirty() {
      meta.pending = true;
      saveMeta();
      channel?.postMessage({ tabId, deviceId: meta.deviceId, generation: meta.generation });
      autosave?.notifyDirty();
      if (!autosave) emit({ ...currentStatus, status: 'pending', dirty: true });
    },
    reconcile,
    setEnabled(value) {
      meta.enabled = Boolean(value);
      meta.configured = true;
      saveMeta();
      if (!meta.enabled) {
        stopAutosave();
        emit({ ...currentStatus, status: 'local' });
        return Promise.resolve(null);
      }
      return reconcile();
    },
    async syncNow() {
      if (!meta.enabled) {
        meta.enabled = true;
        meta.configured = true;
        saveMeta();
      }
      try {
        if (currentStatus.status === 'conflict') {
          stopAutosave();
          return await reconcile();
        }
        if (!autosave) {
          const result = await reconcile();
          if (autosave && meta.pending) return await autosave.syncNow();
          return result;
        }
        if (!meta.pending) return await reconcile();
        return await autosave.syncNow();
      } catch (error) {
        if (error.status === 409 || error.code === 409) {
          stopAutosave();
          return reconcile();
        }
        throw error;
      }
    },
    reset() {
      stopAutosave();
      meta.enabled = false;
      meta.userId = null;
      meta.baseRevision = 0;
      saveMeta();
      emit({ ...currentStatus, status: meta.pending ? 'pending' : 'local', baseRevision: 0, lastSyncedAt: null });
    },
    beginNewGeneration() {
      meta.generation = uuid();
      meta.pending = true;
      saveMeta();
      if (autosave) startAutosave();
      else emit({ ...currentStatus, status: 'pending', dirty: true });
    },
    exportSave() {
      return serializeGameSave(getState(), meta.generation);
    },
    importSave(raw) {
      const parsed = deserializeGameSave(raw, { migrate: migrateGameState });
      replaceState(parsed.state, { remote: false });
      meta.generation = parsed.generation || uuid();
      meta.baseRevision = 0;
      meta.pending = true;
      saveMeta();
      if (autosave) startAutosave();
      else emit({ ...currentStatus, status: 'pending', dirty: true });
      return parsed;
    },
    getStatus: snapshot,
    subscribe(listener) { listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener); },
    destroy() {
      stopAutosave();
      listeners.clear();
      channel?.close();
      globalThis.window?.removeEventListener?.('storage', onStorage);
    },
  };
}
