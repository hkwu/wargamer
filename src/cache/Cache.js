import CacheEntry from './CacheEntry';
import CacheMeta from './CacheMeta';

/**
 * Options for the Cache constructor.
 * @typedef {Object} CacheOptions
 * @property {?number} [entryTTL=null] - The time to live in milliseconds for
 *   individual cache entries.
 * @property {?number} [cacheTTL=null] - The time to live in milliseconds for
 *   the entire cache.
 */

/**
 * @classdesc A data cache.
 */
class Cache {
  /**
   * Constructor.
   * @param {CacheOptions} [options={}] - The options for the cache.
   */
  constructor(options = {}) {
    const { entryTTL = null, cacheTTL = null } = options;

    /**
     * The TTL for cache entries in milliseconds. `null` if there is no TTL.
     * @type {?number}
     * @private
     */
    this.entryTimeToLive = entryTTL;

    /**
     * The TTL for the entire cache in milliseconds. `null` if there is no TTL.
     * @type {?number}
     * @private
     */
    this.cacheTimeToLive = cacheTTL;

    /**
     * The metadata store for the cache.
     * @type {CacheMeta}
     * @private
     */
    this.meta = new CacheMeta();

    /**
     * The data store for the cache.
     * @type {Map.<string, *>}
     * @private
     */
    this.store = new Map();
  }

  /**
   * The number of keys in the cache.
   * @type {number}
   */
  get size() {
    return this.store.size;
  }

  /**
   * `true` if the cache has no keys stored, else `false`. Prunes expired keys
   *   before returning the result.
   * @type {boolean}
   */
  get empty() {
    this.expiredCheck();

    return this.size === 0;
  }

  /**
   * The metadata for the cache.
   * @type {Object} The cache metadata.
   */
  get statistics() {
    return {
      ...this.meta.serialize(),
      size: this.size,
    };
  }

  /**
   * Whether or not the cache contents have exceeded their time to live.
   * @type {boolean}
   */
  get expired() {
    if (!this.cacheTimeToLive) {
      return false;
    }

    const now = new Date();
    const then = this.meta.resetAt || this.meta.createdAt;

    return now.getTime() - then.getTime() >= this.cacheTimeToLive;
  }

  /**
   * Gets a value from the cache.
   * @param {string} key - The key of the data to get.
   * @returns {*} The cached value, or `undefined` if not found.
   */
  get(key) {
    this.expiredCheck();

    const got = this.store.get(key);

    if (!got || got.expired) {
      this.meta.miss().expire();
      this.store.delete(key);

      return undefined;
    }

    this.meta.hit();
    got.touch();

    return got.value;
  }

  /**
   * Sets a value in the cache.
   * @param {string} key - The key of the data to store.
   * @param {*} value - The value to store.
   * @returns {Cache} The instance this method was called on.
   */
  set(key, value) {
    this.expiredCheck();

    const entry = new CacheEntry({ value, timeToLive: this.entryTimeToLive });

    this.store.set(key, entry);

    return this;
  }

  /**
   * Deletes a key from the cache.
   * @param {string} key - The key of the data to delete.
   * @returns {Cache} The instance this method was called on.
   */
  delete(key) {
    if (!this.expiredCheck()) {
      this.store.delete(key);
    }

    return this;
  }

  /**
   * Returns an array of the keys in the cache.
   * @returns {Array.<string>} The keys in the cache.
   */
  keys() {
    this.expiredCheck();

    return [...this.store.keys()];
  }

  /**
   * Clears the entries in the cache.
   * @returns {Cache} The instance this method was called on.
   */
  clear() {
    this.store.clear();
    this.meta.reset();

    return this;
  }

  /**
   * Checks if the cache contents have exceeded their time to live. If so, resets
   *   the cache.
   * @returns {boolean} `true` if the cache was reset, else `false`.
   * @private
   */
  expiredCheck() {
    if (this.expired) {
      this.clear();

      return true;
    }

    return false;
  }
}

export default Cache;
