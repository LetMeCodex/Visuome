export class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get value from memory cache.
   * @param {string} key
   * @param {string} urlNamespace Active tab URL namespace to isolate pages.
   */
  get(key, urlNamespace = "") {
    const fullKey = urlNamespace ? `${urlNamespace}::${key}` : key;
    const entry = this.cache.get(fullKey);
    if (!entry) return null;
    if (entry.expires && Date.now() > entry.expires) {
      this.cache.delete(fullKey);
      return null;
    }
    return entry.value;
  }

  /**
   * Set value in memory cache.
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMs Time to live in milliseconds (0 for unlimited).
   * @param {string} urlNamespace Active tab URL namespace to isolate pages.
   */
  set(key, value, ttlMs = 0, urlNamespace = "") {
    const fullKey = urlNamespace ? `${urlNamespace}::${key}` : key;
    const expires = ttlMs > 0 ? Date.now() + ttlMs : 0;
    this.cache.set(fullKey, { value, expires });
  }

  /**
   * Delete entry.
   */
  delete(key, urlNamespace = "") {
    const fullKey = urlNamespace ? `${urlNamespace}::${key}` : key;
    this.cache.delete(fullKey);
  }

  /**
   * Clear cache (optionally filtered by URL).
   */
  clear(urlNamespace = "") {
    if (urlNamespace) {
      for (const k of this.cache.keys()) {
        if (k.startsWith(`${urlNamespace}::`)) {
          this.cache.delete(k);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export class SessionCache {
  /**
   * Get value from sessionStorage cache.
   */
  get(key, urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome::${urlNamespace}::` : "visuome::";
      const fullKey = `${prefix}${key}`;
      const dataStr = sessionStorage.getItem(fullKey);
      if (!dataStr) return null;
      const entry = JSON.parse(dataStr);
      if (entry.expires && Date.now() > entry.expires) {
        sessionStorage.removeItem(fullKey);
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  }

  /**
   * Set value in sessionStorage cache.
   */
  set(key, value, ttlMs = 0, urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome::${urlNamespace}::` : "visuome::";
      const fullKey = `${prefix}${key}`;
      const expires = ttlMs > 0 ? Date.now() + ttlMs : 0;
      sessionStorage.setItem(fullKey, JSON.stringify({ value, expires }));
    } catch (error) {
      console.warn("Visuome SessionCache set failed:", error);
    }
  }

  /**
   * Delete entry.
   */
  delete(key, urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome::${urlNamespace}::` : "visuome::";
      const fullKey = `${prefix}${key}`;
      sessionStorage.removeItem(fullKey);
    } catch {}
  }

  /**
   * Clear all matching entries.
   */
  clear(urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome::${urlNamespace}::` : "visuome::";
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(prefix)) {
          sessionStorage.removeItem(key);
        }
      }
    } catch {}
  }
}

export class PersistentCache {
  /**
   * Get value from localStorage cache.
   */
  get(key, urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome_p::${urlNamespace}::` : "visuome_p::";
      const fullKey = `${prefix}${key}`;
      const dataStr = localStorage.getItem(fullKey);
      if (!dataStr) return null;
      const entry = JSON.parse(dataStr);
      if (entry.expires && Date.now() > entry.expires) {
        localStorage.removeItem(fullKey);
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  }

  /**
   * Set value in localStorage cache.
   */
  set(key, value, ttlMs = 0, urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome_p::${urlNamespace}::` : "visuome_p::";
      const fullKey = `${prefix}${key}`;
      const expires = ttlMs > 0 ? Date.now() + ttlMs : 0;
      localStorage.setItem(fullKey, JSON.stringify({ value, expires }));
    } catch (error) {
      console.warn("Visuome PersistentCache set failed:", error);
    }
  }

  /**
   * Delete entry.
   */
  delete(key, urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome_p::${urlNamespace}::` : "visuome_p::";
      const fullKey = `${prefix}${key}`;
      localStorage.removeItem(fullKey);
    } catch {}
  }

  /**
   * Clear all matching entries.
   */
  clear(urlNamespace = "") {
    try {
      const prefix = urlNamespace ? `visuome_p::${urlNamespace}::` : "visuome_p::";
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
  }
}

export const memoryCache = new MemoryCache();
export const sessionCache = new SessionCache();
export const persistentCache = new PersistentCache();
