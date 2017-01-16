import CacheManager from '../cache/CacheManager';

/**
 * @classdesc A module within an API client.
 */
class ClientModule {
  /**
   * The module cache manager.
   * @type {CacheManager}
   * @static
   * @private
   */
  static caches = new CacheManager();

  /**
   * The default time to live for cache contents.
   * @type {number}
   */
  DEFAULT_CACHE_TTL = 3600 * 1000;

  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   * @param {string} moduleName - The name of the module.
   */
  constructor(client, moduleName) {
    /**
     * The API client this module belongs to.
     * @type {BaseClient}
     */
    this.client = client;

    /**
     * The name of the module.
     * @type {string}
     */
    this.moduleName = moduleName;
  }

  /**
   * The unique cache identifier prefix for this module.
   * @type {string}
   */
  get cachePrefix() {
    return `${this.client.type}:${this.moduleName}`;
  }

  /**
   * Gets a module cache.
   * @param {string} name - The name of the cache to get.
   * @returns {(Cache|undefined)} The cache if found, otherwise `undefined`.
   */
  getCache(name) {
    return this.constructor.caches.get(`${this.cachePrefix}:${name}`);
  }

  /**
   * Checks if a module cache exists.
   * @param {string} name - The name of the cache.
   * @returns {boolean} True if the cache exists, else false.
   */
  hasCache(name) {
    return this.constructor.caches.has(`${this.cachePrefix}:${name}`);
  }

  /**
   * Creates a new module cache.
   * @param {string} name - The name of the cache.
   * @param {CacheOptions} [options={}] - The cache options.
   * @param {boolean} [safe=true] - If `true`, a new cache will not be created
   *   if it conflicts with another cache.
   * @returns {Cache} The `Cache` that was created, or the existing cache with
   *   this name if the `safe` option is enabled.
   */
  createCache(name, options = {}, safe = true) {
    if (safe && this.hasCache(name)) {
      return this.getCache(name);
    }

    return this.constructor.caches.create(`${this.cachePrefix}:${name}`, options);
  }
}

export default ClientModule;
