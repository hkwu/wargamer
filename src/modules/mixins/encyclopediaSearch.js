/**
 * Searches for an entry in the encyclopedia endpoint for an API.
 * @param {Object} params - The parameters for the search.
 * @param {(number|string)} params.identifier - The entry identifier to use for lookup.
 * If a number is supplied, it is treated as the entry's ID.
 * If a string is supplied, the identifier is matched against entry names with
 *   the closest match being selected.
 * @param {RequestOptions} [params.options={}] - The options for the request.
 * @param {string} params.indexEndpoint - The endpoint to use for indexing entries.
 * @param {string} params.dataEndpoint - The endpoint to use for returning entry
 *   data.
 * @param {string} params.identifierKey - The key which identifies entries.
 * @param {Fuse} params.fuse - The Fuse object to use for matching against indexed
 *   entries.
 * @param {Array.<string>} params.searchFields - The fields to request when hitting
 *   the `indexEndpoint`. The `identifierKey` will automatically be appended to
 *   this array.
 * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
 *   matched entry, or `null` if no entries were matched.
 * @private
 */
export default function encyclopediaSearch(params) {
  return new Promise((resolve) => {
    const {
      identifier,
      options = {},
      indexEndpoint,
      dataEndpoint,
      identifierKey,
      fuse,
      searchFields,
    } = params;

    if (typeof identifier === 'number') {
      resolve(
        this.client.get(dataEndpoint, { [identifierKey]: identifier }, options)
          .then(response => response.data[identifier]),
      );
    } else if (typeof identifier === 'string') {
      resolve(
        this.client.get(indexEndpoint, { fields: [...searchFields, identifierKey] }, options)
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
