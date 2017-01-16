import Cache from './Cache';

/**
 * @classdesc Manages a set of caches.
 */
class CacheManager {
  /**
   * Constructor.
   */
  constructor() {
    /**
     * The caches being managed.
     * @type {Map.<string, Cache>}
     * @private
     */
    this.caches = new Map();
  }

  /**
   * Creates a cache.
   * @param {string} identifier - The cache identifier.
   * @param {CacheOptions} options - Options to construct the cache with.
   * @returns {Cache} The `Cache` that was created.
   */
  create(identifier, options = {}) {
    const cache = new Cache(options);

    this.caches.set(identifier, cache);

    return cache;
  }

  /**
   * Gets a cache.
   * @param {string} identifier - The cache identifier.
   * @returns {(Cache|undefined)} - The cache, or `undefined` if it doesn't exist.
   */
  get(identifier) {
    return this.caches.get(identifier);
  }

  /**
   * Checks if a cache exists.
   * @param {string} identifier - The cache identifier.
   * @returns {boolean} - `true` if the cache exists, else `false`.
   */
  has(identifier) {
    return this.caches.has(identifier);
  }

  /**
   * Removes a cache.
   * @param {string} identifier - The cache identifier.
   * @returns {(Cache|undefined)} The `Cache` that was removed, or `undefined`
   *   if it didn't exist.
   */
  destroy(identifier) {
    const cache = this.get(identifier);

    this.caches.delete(identifier);

    return cache;
  }
}

export default CacheManager;
