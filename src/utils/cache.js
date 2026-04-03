/**
 * Simple in-memory TTL cache.
 * Prevents hammering the GitHub API on every request by caching results for
 * a configurable duration (default: 30 minutes).
 */

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

class Cache {
  constructor(ttlMs = DEFAULT_TTL_MS) {
    this._ttlMs = ttlMs;
    this._store = new Map();
  }

  /** Store a value under key. */
  set(key, value) {
    this._store.set(key, { value, expiresAt: Date.now() + this._ttlMs });
  }

  /**
   * Retrieve a cached value.
   * Returns undefined if the key is missing or has expired.
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /** Remove a cached entry. */
  delete(key) {
    this._store.delete(key);
  }

  /** Remove all expired entries. */
  prune() {
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now > entry.expiresAt) this._store.delete(key);
    }
  }

  /** Current number of live (unexpired) entries. */
  get size() {
    this.prune();
    return this._store.size;
  }
}

// Export a shared singleton used by all routes.
const cache = new Cache();

module.exports = { Cache, cache };
