/**
 * Identical to `Array.prototype.map()` except for object values.
 * @param {Object} object - The object whose values will be mapped.
 * @param {Function} callback - The callback to map the object values. Gets passed
 *   equivalent parameters as `Array.prototype.map()`.
 * @returns {Object} A new mapped object.
 * @private
 */
export default function mapValues(object, callback = value => value) {
  const entries = Object.entries(object);

  return entries.reduce((mapped, [key, val]) => {
    mapped[key] = callback(val, key, object); // eslint-disable-line no-param-reassign

    return mapped;
  }, {});
}
