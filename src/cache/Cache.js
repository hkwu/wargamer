import CacheEntry from './CacheEntry';
import CacheMeta from './CacheMeta';

/**
 * Options for the Cache constructor.
 * @typedef {Object} CacheOptions
 * @property {?number} [timeToLive=null] - The time to live in milliseconds for
 *   individual cache entries. `null` if there is no TTL.
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
    const { timeToLive = null } = options;

    /**
     * The TTL for cache entries in milliseconds. `null` if there is no TTL.
     * @type {?number}
     * @private
     */
    this.entryTimeToLive = timeToLive;

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
   * The keys in the cache.
   * @type {Array.<string>}
   */
  get keys() {
    return [...this.store.keys()];
  }

  /**
   * `true` if the cache has no keys stored, else `false`. Prunes expired keys
   *   before returning the result.
   * @type {boolean}
   */
  get empty() {
    return this.size === 0;
  }

  /**
   * The metadata for the cache.
   * @type {Object}
   */
  get statistics() {
    return {
      ...this.meta.serialize(),
      size: this.size,
    };
  }

  /**
   * Gets a value from the cache.
   * @param {string} key - The key of the data to get.
   * @returns {*} The cached value, or `undefined` if not found.
   */
  get(key) {
    const got = this.store.get(key);

    if (!got) {
      this.meta.miss();

      return undefined;
    } else if (got.expired) {
      this.meta.expire();

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
    this.store.delete(key);

    return this;
  }

  /**
   * Clears the entries in the cache.
   * @returns {Cache} The instance this method was called on.
   */
  clear() {
    this.store.clear();
    this.meta.clear();

    return this;
  }
}

export default Cache;
