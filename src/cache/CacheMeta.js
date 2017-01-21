/**
 * @classdesc Stores metadata for a cache.
 */
class CacheMeta {
  /**
   * Constructor.
   */
  constructor() {
    /**
     * The time this cache was created.
     * @type {Date}
     */
    this.createdAt = new Date();

    /**
     * The time this cache was last accessed. `null` if the cache was never accessed.
     * @type {?Date}
     */
    this.accessedAt = null;

    /**
     * The time this cache was last updated. `null` if the cache was never updated.
     * @type {?Date}
     */
    this.updatedAt = null;

    /**
     * The time this cache was last reset. `null` if the cache was never reset.
     * @type {?Date}
     */
    this.clearedAt = null;

    /**
     * The number of hits on the cache.
     * @type {number}
     */
    this.hits = 0;

    /**
     * The number of misses on the cache.
     * @type {number}
     */
    this.misses = 0;

    /**
     * The number of entries that have expired in the cache.
     * @type {number}
     */
    this.expired = 0;
  }

  /**
   * Records a cache hit.
   * @returns {CacheMeta} The instance this method was called on.
   */
  hit() {
    this.accessedAt = new Date();
    this.hits += 1;

    return this;
  }

  /**
   * Records a cache miss.
   * @returns {CacheMeta} The instance this method was called on.
   */
  miss() {
    this.accessedAt = new Date();
    this.misses += 1;

    return this;
  }

  /**
   * Records a cache entry expiry.
   * @returns {CacheMeta} The instance this method was called on.
   */
  expire() {
    this.expired += 1;

    return this;
  }

  /**
   * Resets the current tracked metadata.
   * @returns {CacheMeta} The instance this method was called on.
   */
  clear() {
    const now = new Date();

    this.updatedAt = now;
    this.clearedAt = now;
    this.hits = 0;
    this.misses = 0;
    this.expired = 0;

    return this;
  }

  /**
   * Returns the stored metadata as an object.
   * @returns {Object} An object containing the stored metadata.
   */
  serialize() {
    return {
      createdAt: this.createdAt,
      accessedAt: this.accessedAt,
      updatedAt: this.updatedAt,
      clearedAt: this.clearedAt,
      hits: this.hits,
      misses: this.misses,
      expired: this.expired,
    };
  }
}

export default CacheMeta;
