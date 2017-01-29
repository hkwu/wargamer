import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';
import encyclopediaSearch from '../mixins/encyclopediaSearch';
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
   * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
   *   matched vehicle, or `null` if no vehicles were matched.
   */
  findVehicle(identifier) {
    return encyclopediaSearch.call(this, {
      identifier,
      indexEndpoint: 'encyclopedia/vehicles',
      dataEndpoint: 'encyclopedia/vehicles',
      identifierKey: 'tank_id',
      fuse: this.fuse,
      searchFields: [
        'name',
        'short_name',
      ],
    });
  }

  /**
   * Localizes an achievement section slug. The returned value is the section's
   *   name.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeAchievementSection(slug) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'achievement_sections',
      slug,
    }).then(section => section && section.name);
  }

  /**
   * Localizes a vehicle type slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeVehicleType(slug) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'vehicle_types',
      slug,
    });
  }

  /**
   * Localizes a vehicle nation slug.
   * @param {string} slug - The slug.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeVehicleNation(slug) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'vehicle_nations',
      slug,
    });
  }
}

export default Tankopedia;
