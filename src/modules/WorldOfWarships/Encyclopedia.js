import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';
import localize from '../mixins/localize';

/**
 * @classdesc Module for the World of Warships Encyclopedia endpoint.
 * @extends ClientModule
 */
class Encyclopedia extends ClientModule {
  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client) {
    super(client, 'encyclopedia');

    /**
     * The module's Fuse object.
     * @type {Fuse}
     * @private
     */
    this.fuse = new Fuse([], {
      keys: [
        'name',
      ],
    });
  }

  /**
   * Searches for a ship by name or ID and returns its entry from the
   *   `encyclopedia/ships` endpoint.
   * @param {(number|string)} identifier - The ship identifier to use for lookup.
   * If a number is supplied, it is treated as the ship's ID.
   * If a string is supplied, the identifier is matched against ship names with
   *   the closest match being selected.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
   *   matched ship, or `null` if no ships were matched.
   */
  findShip(identifier, options = {}) {
    return new Promise((resolve) => {
      if (typeof identifier === 'number') {
        resolve(
          this.client.get(
            'encyclopedia/ships',
            { ship_id: identifier },
            options,
          ).then(response => response.data[identifier]),
        );
      } else if (typeof identifier === 'string') {
        resolve(
          this.client.get(
            'encyclopedia/ships', {
              fields: [
                'name',
                'ship_id',
              ],
            },
            options,
          ).then((response) => {
            const ships = response.data;

            this.fuse.set(Object.keys(ships).reduce(
              (accumulated, next) => [...accumulated, ships[next]],
              [],
            ));

            const results = this.fuse.search(identifier);

            if (!results.length) {
              return null;
            }

            const [{ ship_id }] = results;

            return this.client.get(
              'encyclopedia/ships',
              { ship_id },
              options,
            ).then(detailedResponse => detailedResponse.data[ship_id]);
          }),
        );
      }

      throw new TypeError('Expected a string or number as the ship identifier.');
    });
  }

  /**
   * Localizes a ship type slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipType(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'ship_types',
      slug,
      options,
    });
  }

  /**
   * Localizes a language slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeLanguage(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'languages',
      slug,
      options,
    });
  }

  /**
   * Localizes a ship modification slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipModification(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'ship_modifications',
      slug,
      options,
    });
  }

  /**
   * Localizes a ship module slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipModule(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'ship_modules',
      slug,
      options,
    });
  }

  /**
   * Localizes a ship nation slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeShipNation(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'ship_nations',
      slug,
      options,
    });
  }
}

export default Encyclopedia;
