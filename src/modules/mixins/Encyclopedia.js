/**
 * Searches for an entry in the encyclopedia endpoint for an API.
 * @param {Object} params - The parameters for the search.
 * @param {(number|string)} params.identifier - The entry identifier to use for lookup.
 * If a number is supplied, it is treated as the entry's ID.
 * If a string is supplied, the identifier is matched against entry names with
 *   the closest match being selected.
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
 * @this {ClientModule}
 * @private
 */
export const resolveEntry = function resolveEntry(params) {
  const {
    identifier,
    indexEndpoint,
    dataEndpoint,
    identifierKey,
    fuse,
    searchFields,
  } = params;

  if (typeof identifier === 'number') {
    return this.client.get(dataEndpoint, { [identifierKey]: identifier })
      .then(response => response.data[identifier]);
  } else if (typeof identifier === 'string') {
    return this.client.get(indexEndpoint, { fields: [...searchFields, identifierKey] })
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

        return Promise.all([
          matchedId,
          this.client.get(dataEndpoint, { [identifierKey]: matchedId }),
        ]);
      })
      .then(([matchedId, response]) => response.data[matchedId]);
  }

  return Promise.reject(new TypeError('Expected a string or number as the entry identifier.'));
};

/**
 * Extracts the top modules of each type from a given module tree. The modules
 *   with the highest experience cost are considered the 'top' modules.
 * @param {Object} moduleTree - The module tree.
 * @returns {Object} An object containing the top modules of each type found in
 *   the module tree. The module types are the keys and the module data are the values.
 * @private
 */
export const extractTopModules = function extractTopModules(moduleTree) {
  return Object.keys(moduleTree).reduce((topModules, moduleId) => {
    const module = moduleTree[moduleId];
    const { price_xp, type } = module;

    if (!topModules[type] || price_xp > topModules[type].price_xp) { // eslint-disable-line camelcase, max-len
      return {
        ...topModules,
        [type]: module,
      };
    }

    return topModules;
  }, {});
};

/**
 * Localizes a slug using values returned from an API endpoint.
 * @param {Object} params - The function parameters.
 * @param {string} params.method - The API method which returns the localization data.
 * @param {string} params.type - The type of slug being localized.
 * @param {string} params.slug - The slug being localized.
 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
 *   translated slug, or `undefined` if it couldn't be translated.
 * @this {ClientModule}
 * @private
 */
export const localize = function localize({ method, type, slug }) {
  return this.client.get(method, {}).then((response) => {
    const translations = response.data[type];

    if (!translations || typeof translations !== 'object') {
      throw new Error(`Invalid translation type: ${type}.`);
    }

    return translations[slug];
  });
};
