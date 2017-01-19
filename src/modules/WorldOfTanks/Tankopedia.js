import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';

/**
 * @classdesc Module for the World of Tanks Tankopedia endpoint.
 * @extends ClientModule
 */
class Tankopedia extends ClientModule {
  /**
   * The module's Fuse object.
   * @type {Fuse}
   * @private
   */
  fuse = new Fuse([], {
    keys: [
      'name',
      'short_name',
    ],
  });

  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client) {
    super(client, 'tankopedia');
  }

  /**
   * Searches for a vehicle by name or ID and returns its entry from the
   *   `encyclopedia/vehicles` endpoint.
   * @param {(number|string)} identifier - The vehicle identifier to use for
   *   lookup. If a number is supplied, it is treated as the vehicle's ID.
   *   If a string is supplied, the identifier is matched against vehicle names
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
   * Translates a given slug value using one of the mappings returned from the API.
   * @param {string} type - The type of translation to perform.
   * @param {string} slug - The slug to translate.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateSlug(type, slug) {
    return this.client.get('encyclopedia/info').then((response) => {
      const translationMap = response.data[type];

      if (!translationMap || typeof translationMap !== 'object') {
        throw new Error(`Invalid translation type: ${type}.`);
      }

      return translationMap[slug];
    });
  }

  /**
   * Translates a crew role slug.
   * @param {string} roleSlug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateCrewRole(roleSlug) {
    return this.translateSlug('vehicle_crew_roles', roleSlug);
  }

  /**
   * Translates a language slug.
   * @param {string} languageSlug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateLanguage(languageSlug) {
    return this.translateSlug('languages', languageSlug);
  }

  /**
   * Translates an achievement section slug. The returned value is the section's
   *   name.
   * @param {string} achievementSectionSlug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateAchievementSection(achievementSectionSlug) {
    return this.translateSlug(
      'achievement_sections',
      achievementSectionSlug,
    ).then(section => section && section.name);
  }

  /**
   * Translates a vehicle type slug.
   * @param {string} vehicleTypeSlug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateVehicleType(vehicleTypeSlug) {
    return this.translateSlug('vehicle_types', vehicleTypeSlug);
  }

  /**
   * Translates a vehicle nation slug.
   * @param {string} vehicleNationSlug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateVehicleNation(vehicleNationSlug) {
    return this.translateSlug('vehicle_nations', vehicleNationSlug);
  }
}

export default Tankopedia;
