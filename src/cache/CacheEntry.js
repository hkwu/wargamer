/**
 * @classdesc An entry within a cache.
 */
class CacheEntry {
  /**
   * Constructor.
   * @param {Object} options - The options to configure this entry with.
   * @param {*} options.value - The value of this cache entry.
   * @param {?number} [options.timeToLive=null] - The time to live for this
   *   entry in milliseconds. `null` if there is no TTL.
   */
  constructor(options) {
    const { value, timeToLive = null } = options;

    /**
     * The value of this cache entry.
     * @type {*}
     */
    this.value = value;

    /**
     * The duration in milliseconds that this entry is valid for.
     * @type {number}
     */
    this.entryTimeToLive = timeToLive;

    /**
     * The time this entry was created.
     * @type {Date}
     */
    this.createdAt = new Date();

    /**
     * The time this entry was last accessed, or `null` if it was never accessed
     *   before.
     * @type {?Date}
     */
    this.accessedAt = null;
  }

  /**
   * Whether or not this entry has exceeded its time to live.
   * @type {boolean}
   */
  get expired() {
    if (!this.entryTimeToLive) {
      return false;
    }

    const now = new Date();
    const then = this.createdAt;

    return now.getTime() - then.getTime() >= this.entryTimeToLive;
  }

  /**
   * Updates the last accessed time for this entry.
   */
  touch() {
    this.accessedAt = new Date();
  }
}

export default CacheEntry;
