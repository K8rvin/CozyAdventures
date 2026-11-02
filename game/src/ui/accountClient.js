const SESSION_KEY = 'cozy_account_session_v1';

function apiBase() {
  const configured = String(globalThis.COZY_API_BASE_URL || '').replace(/\/$/, '');
  if (configured) return configured;
  const portrait = String(globalThis.KNIGHT_IMAGE_API_URL || '').replace(/\/$/, '');
  return portrait.endsWith('/api/knight-image') ? portrait.slice(0, -'/api/knight-image'.length) : '';
}

export function createAccountClient(options = {}) {
  const base = (options.baseUrl ?? apiBase()).replace(/\/$/, '');
  const storage = options.storage || globalThis.sessionStorage;
  const fetchImpl = options.fetchImpl || globalThis.fetch?.bind(globalThis);
  const listeners = new Set();
  let session = null;
  try { session = JSON.parse(storage?.getItem(SESSION_KEY) || 'null'); } catch { session = null; }
  let profile = null;
  let status = session?.token ? 'loading' : 'anonymous';
  let lastError = '';

  function snapshot() {
    return {
      status, profile, lastError, configured: Boolean(base),
      supporter: { active: profile?.supporter?.active === true, grantedAt: profile?.supporter?.grantedAt || null },
    };
  }
  function emit() {
    const value = snapshot();
    for (const listener of listeners) listener(value);
  }
  function setStatus(next, error = '') {
    status = next;
    lastError = error;
    emit();
  }
  function saveSession(value) {
    session = value;
    try {
      if (value) storage?.setItem(SESSION_KEY, JSON.stringify(value));
      else storage?.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  }
  async function request(path, init = {}) {
    if (!base) throw new Error('Сервер аккаунта не настроен');
    if (!fetchImpl) throw new Error('Сеть недоступна');
    const response = await fetchImpl(`${base}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
        ...(init.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Сервер аккаунта недоступен');
      error.status = response.status;
      error.code = data.code;
      error.data = data;
      throw error;
    }
    return data;
  }
  async function refresh() {
    if (!session?.token) {
      profile = null;
      setStatus('anonymous');
      return snapshot().profile;
    }
    setStatus('loading');
    try {
      const data = await request('/api/auth/me');
      profile = { ...(data.user || {}), supporter: data.supporter, cloud: data.cloud ?? data.save ?? null };
      setStatus('authenticated');
      return profile;
    } catch (error) {
      profile = null;
      if (error.status === 401) saveSession(null);
      setStatus(error.status === 401 ? 'anonymous' : 'error', error.message);
      throw error;
    }
  }
  async function authenticate(path, body, clearOnFailure = false) {
    setStatus('loading');
    try {
      const result = await request(path, { method: 'POST', body: JSON.stringify(body) });
      saveSession({ token: result.sessionToken, expiresAt: result.expiresAt || null });
      profile = result.user ? { ...result.user, supporter: result.supporter, cloud: result.cloud } : null;
      if (profile) setStatus('authenticated');
      else await refresh();
      return profile;
    } catch (error) {
      if (clearOnFailure) {
        saveSession(null);
        profile = null;
      }
      setStatus('error', error.message);
      throw error;
    }
  }
  function register(credentials) {
    return authenticate('/api/auth/register', credentials, true);
  }
  function login(credentials) {
    return authenticate('/api/auth/login', credentials, true);
  }
  function changePassword(credentials) {
    return authenticate('/api/auth/change-password', credentials);
  }
  async function logout() {
    try {
      if (session?.token) await request('/api/auth/logout', { method: 'POST' });
    } finally {
      saveSession(null);
      profile = null;
      setStatus('anonymous');
    }
  }
  return {
    snapshot,
    subscribe(listener) { listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener); },
    isSupporter() { return profile?.supporter?.active === true; },
    getAccessToken() { return session?.token || null; },
    refresh,
    register,
    login,
    changePassword,
    logout,
    async getCloudSave() {
      const data = await request('/api/cloud-save');
      if (!data.save) return null;
      return { ...data.save, serverTime: data.serverTime };
    },
    putCloudSave(payload) { return request('/api/cloud-save', { method: 'PUT', body: JSON.stringify(payload) }); },
  };
}
