/**
 * Consumes an object and produces a new object with the same keys, but inserted
 *   in sorted order.
 * @param {Object} object - The object to sort.
 * @returns {Object} The sorted object.
 * @private
 */
export default function sortObjectByKey(object) {
  return Object.keys(object).sort().reduce((built, next) => {
    built[next] = object[next]; // eslint-disable-line no-param-reassign

    return built;
  }, {});
}
