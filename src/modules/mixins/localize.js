/**
 * Localizes a slug using values returned from an API endpoint.
 * @param {Object} params - The function parameters.
 * @param {string} params.method - The API method which returns the localization data.
 * @param {string} params.type - The type of slug being localized.
 * @param {string} params.slug - The slug being localized.
 * @param {RequestOptions} [params.options={}] - The options for the request.
 * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
 *   translated slug, or `undefined` if it couldn't be translated.
 * @this {ClientModule}
 * @private
 */
export default function localize({ method, type, slug, options = {} }) {
  return this.client.get(method, {}, options).then((response) => {
    const translations = response.data[type];

    if (!translations || typeof translations !== 'object') {
      throw new Error(`Invalid translation type: ${type}.`);
    }

    return translations[slug];
  });
}
