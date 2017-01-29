/**
 * Identical to `Array.prototype.map()` except for object values.
 * @param {Object} object - The object whose values will be mapped.
 * @param {Function} callback - The callback to map the object values. Gets passed
 *   equivalent parameters as `Array.prototype.map()`.
 * @returns {Object} A new mapped object.
 * @private
 */
export default function mapValues(object, callback = value => value) {
  const keys = Object.keys(object);

  return keys.reduce((mapped, nextKey) => {
    mapped[nextKey] = callback(object[nextKey], nextKey, object); // eslint-disable-line no-param-reassign, max-len

    return mapped;
  }, {});
}
