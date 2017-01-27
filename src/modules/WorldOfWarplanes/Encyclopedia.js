import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';
import encyclopediaSearch from '../mixins/encyclopediaSearch';

/**
 * @classdesc Module for the World of Warplanes Encyclopedia endpoint.
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
        'name_i18n',
      ],
    });
  }

  /**
   * Searches for a plane by name or ID and returns its entry from the
   *   `encyclopedia/planes` endpoint.
   * @param {(number|string)} identifier - The plane identifier to use for lookup.
   * If a number is supplied, it is treated as the plane's ID.
   * If a string is supplied, the identifier is matched against plane names with
   *   the closest match being selected.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<?Object, Error>} A promise resolving to the data for the
   *   matched plane, or `null` if no planes were matched.
   */
  findPlane(identifier, options = {}) {
    return encyclopediaSearch.call(this, {
      identifier,
      options,
      indexEndpoint: 'encyclopedia/planes',
      dataEndpoint: 'encyclopedia/planeinfo',
      identifierKey: 'plane_id',
      fuse: this.fuse,
      searchFields: [
        'name_i18n',
      ],
    });
  }
}

export default Encyclopedia;
