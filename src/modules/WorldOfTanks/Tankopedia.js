import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';
import encyclopediaSearch from '../mixins/encyclopediaSearch';
import extractTopModules from '../mixins/extractTopModules';
import localize from '../mixins/localize';

/**
 * @classdesc Module for the World of Tanks Tankopedia endpoint.
 * @extends ClientModule
 */
class Tankopedia extends ClientModule {
  /**
   * Mapping between module types and their ID field names.
   * @type {Object}
   * @const
   * @private
   */
  MODULE_ID_FIELDS = {
    vehicleChassis: 'suspension_id',
    vehicleEngine: 'engine_id',
    vehicleGun: 'gun_id',
    vehicleRadio: 'radio_id',
    vehicleTurret: 'turret_id',
  };

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
    return encyclopediaSearch.call(this, {
      identifier,
      options,
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
   * Returns the vehicle profile for a given vehicle.
   * @param {number} vehicleId - The vehicle ID to use for lookup.
   * @param {string} [profile='stock'] - The vehicle profile to lookup. Can be
   *   a profile ID, or one of `'stock'` or `'top'`. The top configuration is
   *   determined by picking the most expensive modules to research in the
   *   vehicle's research tree.
   * @returns {Promise.<Object, Error>} A promise resolving to the data for the
   *   matched vehicle profile.
   */
  findVehicleProfile(vehicleId, profile = 'stock') {
    if (profile === 'stock') {
      return this.client.get('encyclopedia/vehicleprofile', { tank_id: vehicleId })
        .then(response => response.data[vehicleId]);
    } else if (profile === 'top') {
      return this.findVehicle(vehicleId)
        .then((vehicleData) => {
          if (!vehicleData) {
            return null;
          }

          const topModules = extractTopModules(vehicleData.modules_tree);
          const queryFields = Object.keys(topModules).reduce((accumulated, next) => {
            const fieldName = this.MODULE_ID_FIELDS[next];

            accumulated[fieldName] = topModules[next].module_id; // eslint-disable-line no-param-reassign, max-len

            return accumulated;
          }, {});

          return this.client.get('encyclopedia/vehicleprofile', { ...queryFields, tank_id: vehicleId })
            .then(response => response.data[vehicleId]);
        });
    }

    return this.client.get('encyclopedia/vehicleprofile', { tank_id: vehicleId, profile_id: profile })
      .then(response => response.data[vehicleId]);
  }

  /**
   * Localizes a crew role slug.
   * @param {string} slug - The slug.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  localizeCrewRole(slug, options = {}) {
    return localize.call(this, {
      method: 'encyclopedia/info',
      type: 'vehicle_crew_roles',
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
