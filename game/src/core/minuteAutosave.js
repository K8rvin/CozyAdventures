const STATUS_MESSAGES = {
  offline: 'Нет связи. Изменения сохранены локально и будут отправлены позже.',
  conflict: 'Облачное сохранение изменилось на другом устройстве. Требуется выбрать версию.',
  error: 'Не удалось синхронизировать сохранение. Изменения сохранены локально.',
};

function isThenable(value) {
  return value && typeof value.then === 'function';
}

function responseStatus(error) {
  return error?.status ?? error?.statusCode ?? error?.response?.status;
}

function isConflict(error) {
  return Number(responseStatus(error) ?? error?.code) === 409;
}

function isOffline(error) {
  if (error?.offline === true || error?.name === 'TypeError' || error?.name === 'NetworkError') return true;
  if (Number(responseStatus(error)) === 0) return true;
  return ['OFFLINE', 'ERR_OFFLINE', 'NETWORK_ERROR', 'ERR_NETWORK'].includes(error?.code);
}

export function createMinuteAutosave(options = {}) {
  const {
    intervalMs = 60000,
    isEnabled = () => true,
    getSnapshot,
    putSnapshot,
    deviceId,
    initialBaseRevision = 0,
    onStatus,
    onConflict,
    scheduler = globalThis,
    loadPending,
    savePending,
    now = () => Date.now(),
  } = options;

  if (!Number.isFinite(intervalMs) || intervalMs <= 0) throw new Error('Интервал автосохранения должен быть положительным числом.');
  if (typeof getSnapshot !== 'function' || typeof putSnapshot !== 'function') {
    throw new Error('Для автосохранения нужны функции getSnapshot и putSnapshot.');
  }
  if (typeof deviceId !== 'string' || !deviceId) throw new Error('Для автосохранения нужен идентификатор устройства.');
  if (typeof isEnabled !== 'function' || typeof now !== 'function'
    || typeof scheduler?.setInterval !== 'function' || typeof scheduler?.clearInterval !== 'function') {
    throw new Error('Некорректные параметры автосохранения.');
  }

  let timer = null;
  let started = false;
  let destroyed = false;
  let initialized = false;
  let initialization = null;
  let inFlight = null;
  let dirty = false;
  let dirtyVersion = 0;
  let baseRevision = initialBaseRevision;
  let lastSyncedAt = null;
  let sequence = 0;
  let status = 'local';
  let errorMessage = null;

  function getStatus() {
    return {
      status,
      dirty,
      baseRevision,
      lastSyncedAt,
      sequence,
      error: errorMessage,
    };
  }

  function updateStatus(next, message = null) {
    if (destroyed) return;
    status = next;
    errorMessage = message;
    if (onStatus) onStatus(getStatus());
  }

  function persistPending() {
    if (!savePending) return;
    try {
      const result = savePending(dirty);
      if (isThenable(result)) {
        Promise.resolve(result).catch(() => updateStatus('error', STATUS_MESSAGES.error));
      }
    } catch {
      updateStatus('error', STATUS_MESSAGES.error);
    }
  }

  function applyLoadedPending(value, versionAtStart) {
    if (destroyed) return;
    if (value === true) {
      if (!dirty) dirtyVersion += 1;
      dirty = true;
    } else if (dirtyVersion === versionAtStart) {
      dirty = false;
    }
    if (started && !inFlight) updateStatus(dirty ? 'pending' : (lastSyncedAt === null ? 'local' : 'synced'));
  }

  function initializePending() {
    if (initialized || !loadPending) return;
    initialized = true;
    const versionAtStart = dirtyVersion;
    try {
      const result = loadPending();
      if (isThenable(result)) {
        initialization = Promise.resolve(result).then(
          (value) => applyLoadedPending(value, versionAtStart),
          () => updateStatus('error', STATUS_MESSAGES.error),
        );
      } else {
        applyLoadedPending(result, versionAtStart);
      }
    } catch {
      updateStatus('error', STATUS_MESSAGES.error);
    }
  }

  function handleFailure(error, payload, requestSequence) {
    if (destroyed || requestSequence !== sequence) return;
    if (isConflict(error)) {
      updateStatus('conflict', STATUS_MESSAGES.conflict);
      if (onConflict) onConflict(error, payload);
    } else {
      const kind = isOffline(error) ? 'offline' : 'error';
      updateStatus(kind, STATUS_MESSAGES[kind]);
    }
  }

  function requestSync() {
    if (destroyed) return Promise.resolve(null);
    if (inFlight) return inFlight;
    if (!initialization && (!dirty || !isEnabled())) return Promise.resolve(null);

    const promise = (async () => {
      if (initialization) await initialization;
      if (destroyed || !dirty || !isEnabled()) return null;

      const snapshot = getSnapshot();
      const requestSequence = sequence + 1;
      sequence = requestSequence;
      const versionAtStart = dirtyVersion;
      const payload = {
        generation: snapshot.generation,
        state: snapshot.state,
        baseRevision,
        deviceId,
        sequence: requestSequence,
      };
      updateStatus('syncing');

      let response;
      try {
        response = await putSnapshot(payload);
        if (isConflict(response)) throw response;
        if (!response || typeof response !== 'object' || response.revision === undefined) {
          throw new Error('Сервер не вернул ревизию сохранения.');
        }
      } catch (error) {
        handleFailure(error, payload, requestSequence);
        throw error;
      }

      if (destroyed || requestSequence !== sequence) return response;
      baseRevision = response.revision;
      lastSyncedAt = now();
      if (dirtyVersion === versionAtStart) dirty = false;
      updateStatus(dirty ? 'pending' : 'synced');
      if (!dirty) persistPending();
      return response;
    })();
    inFlight = promise;
    const clearFlight = () => { if (inFlight === promise) inFlight = null; };
    promise.then(clearFlight, clearFlight);
    return promise;
  }

  function start() {
    if (started || destroyed) return;
    started = true;
    initializePending();
    if (!inFlight && status !== 'error') {
      updateStatus(dirty ? 'pending' : (lastSyncedAt === null ? 'local' : 'synced'));
    }
    timer = scheduler.setInterval(() => {
      requestSync().catch(() => {});
    }, intervalMs);
  }

  function stop() {
    if (timer !== null) scheduler.clearInterval(timer);
    timer = null;
    started = false;
  }

  function notifyDirty() {
    if (destroyed) return;
    dirty = true;
    dirtyVersion += 1;
    if (status !== 'syncing') updateStatus('pending');
    persistPending();
  }

  function destroy() {
    stop();
    destroyed = true;
  }

  return {
    start,
    stop,
    notifyDirty,
    syncNow: requestSync,
    getStatus,
    destroy,
  };
}
