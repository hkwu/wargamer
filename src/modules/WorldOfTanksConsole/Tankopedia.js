import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';
import localize from '../mixins/localize';

/**
 * @classdesc Module for the World of Tanks Console Tankopedia endpoint.
 * @extends ClientModule
 */
class Tankopedia extends ClientModule {
  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client) {
    super(client, 'tankopedia');

    /**
     * The module's Fuse object.
     * @type {Fuse}
     * @private
     */
    this.fuse = new Fuse([], {
      keys: [
        'name',
        'short_name',
      ],
    });
  }

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
  findVehicle(identifier, options = {}) {
    return new Promise((resolve) => {
      if (typeof identifier === 'number') {
        resolve(
          this.client.get(
            'encyclopedia/vehicles',
            { tank_id: identifier },
            options,
          ).then(response => response.data[identifier]),
        );
      } else if (typeof identifier === 'string') {
        resolve(
          this.client.get(
            'encyclopedia/vehicles', {
              fields: [
                'name',
                'short_name',
                'tank_id',
              ],
            },
            options,
          ).then((response) => {
            const vehicles = response.data;

            this.fuse.set(Object.keys(vehicles).reduce(
              (accumulated, next) => [...accumulated, vehicles[next]],
              [],
            ));

            const results = this.fuse.search(identifier);

            if (!results.length) {
              return null;
            }

            const [{ tank_id }] = results;

            return this.client.get(
              'encyclopedia/vehicles',
              { tank_id },
              options,
            ).then(detailedResponse => detailedResponse.data[tank_id]);
          }),
        );
      }

      throw new TypeError('Expected a string or number as the vehicle identifier.');
    });
  }

  /**
   * Localizes an achievement section slug. The returned value is the section's
   *   name.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeAchievementSection(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'achievement_sections',
      slug,
      options,
    }).then(section => section && section.name);
  }

  /**
   * Localizes a vehicle type slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeVehicleType(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'vehicle_types',
      slug,
      options,
    });
  }

  /**
   * Localizes a vehicle nation slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeVehicleNation(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'vehicle_nations',
      slug,
      options,
    });
  }
}

export default Tankopedia;
