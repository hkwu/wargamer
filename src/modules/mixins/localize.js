/**
 * Localizes a slug using values returned from an API endpoint.
 * @param {string} method - The API method which returns the localization data.
 * @param {string} type - The type of slug being localized.
 * @param {string} slug - The slug being localized.
 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
 *   translated slug, or `undefined` if it couldn't be translated.
 * @this {ClientModule}
 * @private
 */
export default function localize(method, type, slug) {
  return this.client.get(method).then((response) => {
    const translations = response.data[type];

    if (!translations || typeof translations !== 'object') {
      throw new Error(`Invalid translation type: ${type}.`);
    }

    return translations[slug];
  });
}
