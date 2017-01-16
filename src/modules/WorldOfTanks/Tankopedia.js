import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';

/**
 * @classdesc Module for the World of Tanks Tankopedia endpoint.
 */
class Tankopedia extends ClientModule {
  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client) {
    super(client, 'tankopedia');

    this.createCache('meta', { cacheTTL: this.DEFAULT_CACHE_TTL });
    this.createCache('vehicles:names', { cacheTTL: this.DEFAULT_CACHE_TTL });
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
   * @throws {TypeError} Thrown if the given identifier is not of the right type.
   */
  findVehicle(identifier, options = {}) {
    if (typeof identifier === 'number') {
      return this.client.get(
        'encyclopedia/vehicles',
        { tank_id: identifier },
        options,
      ).then(response => response.data[identifier]);
    } else if (typeof identifier === 'string') {
      const cache = this.getCache('vehicles:names');
      const handleSearchResults = (results) => {
        if (!results.length) {
          return Promise.resolve(null);
        }

        const [{ tank_id }] = results;

        return this.client.get(
          'encyclopedia/vehicles',
          { tank_id },
          options,
        ).then(response => response.data[tank_id]);
      };

      if (cache.empty) {
        return this.buildVehicleNamesCache(cache).then((builtCache) => {
          const results = builtCache.get('fuse').search(identifier);

          return handleSearchResults(results);
        });
      }

      const results = cache.get('fuse').search(identifier);

      return handleSearchResults(results);
    }

    throw new TypeError('Expected a string or number as the vehicle identifier.');
  }

  /**
   * Translates a given slug value using one of the mappings returned from the API.
   * @param {string} type - The type of translation to perform.
   * @param {string} slug - The slug to translate.
   * @returns {Promise.<(string|undefined), Error>} Promise resolving to the
   *   translated slug, or `undefined` if it couldn't be translated.
   */
  translateSlug(type, slug) {
    const cache = this.getCache('meta');
    const handleTranslation = (translationMap) => {
      if (!translationMap || typeof translationMap !== 'object') {
        return Promise.reject(Error(`Invalid translation type: ${type}.`));
      }

      return Promise.resolve(translationMap[slug]);
    };

    if (cache.empty) {
      return this.buildMetaCache(cache).then((builtCache) => {
        const translationMap = builtCache.get(type);

        return handleTranslation(translationMap);
      });
    }

    const translationMap = cache.get(type);

    return handleTranslation(translationMap);
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

  /**
   * Initializes a cache with Tankopedia meta data.
   * @param {Cache} cache - The cache to use.
   * @returns {Promise.<Cache, Error>} Promise resolving to the cache that was given.
   * @private
   */
  buildMetaCache(cache) {
    return this.client.get('encyclopedia/info').then((response) => {
      Object.keys(response.data).forEach((key) => {
        cache.set(key, response.data[key]);
      });

      return cache;
    });
  }

  /**
   * Initializes a cache with Tankopedia vehicle names.
   * @param {Cache} cache - The cache to use.
   * @returns {Promise.<Cache, Error>} Promise resolving to the cache that was given.
   * @private
   */
  buildVehicleNamesCache(cache) {
    return this.client.get('encyclopedia/vehicles', {
      fields: [
        'name',
        'short_name',
        'tank_id',
      ],
    }).then((response) => {
      const vehicles = response.data;
      const entries = Object.keys(vehicles).reduce(
        (accumulated, next) => [...accumulated, vehicles[next]],
        [],
      );

      cache.set('fuse', new Fuse(entries, {
        keys: [
          'name',
          'short_name',
        ],
      }));

      return cache;
    });
  }
}

export default Tankopedia;
