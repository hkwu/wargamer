/**
 * Searches for a vehicle by name or ID and returns its entry from the
 *   `encyclopedia/vehicles` endpoint.
 * @param {(number|string)} identifier - The vehicle identifier to use for
 *   lookup.
 * If a number is supplied, it is treated as the vehicle's ID.
 * If a string is supplied, the identifier is matched against vehicle names
 *   with the closest match being selected.
 * @param {RequestOptions} [options={}] - The options for the request.
 * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
 *   matched vehicle, or `null` if no vehicles were matched.
 */
export default function encyclopediaSearch(params) {
  return new Promise((resolve) => {
    const {
      identifier,
      indexEndpoint,
      dataEndpoint,
      identifierKey,
      searchFields,
      fuse,
    } = params;

    if (typeof identifier === 'number') {
      resolve(
        this.client.get(dataEndpoint, { [identifierKey]: identifier }, options)
          .then(response => response.data[identifier]),
      );
    } else if (typeof identifier === 'string') {
      resolve(
        this.client.get(indexEndpoint, { fields: searchFields }, options)
          .then((response) => {
            const entries = response.data;

            fuse.set(Object.keys(entries).reduce(
              (accumulated, next) => [...accumulated, entries[next]],
              [],
            ));

            const results = fuse.search(identifier);

            if (!results.length) {
              return null;
            }

            const [{ [identifierKey]: matchedId }] = results;

            return this.client.get(dataEndpoint, { [identifierKey]: matchedId }, options)
              .then(detailedResponse => detailedResponse.data[matchedId]);
          }),
      );
    }

    throw new TypeError('Expected a string or number as the entry identifier.');
  });
}
