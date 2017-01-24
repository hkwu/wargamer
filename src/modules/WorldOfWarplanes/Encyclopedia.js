import Fuse from 'fuse.js';
import ClientModule from '../ClientModule';

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
    return new Promise((resolve) => {
      if (typeof identifier === 'number') {
        resolve(
          this.client.get(
            'encyclopedia/planeinfo',
            { plane_id: identifier },
            options,
          ).then(response => response.data[identifier]),
        );
      } else if (typeof identifier === 'string') {
        resolve(
          this.client.get(
            'encyclopedia/planes', {
              fields: [
                'name_i18n',
                'plane_id',
              ],
            },
            options,
          ).then((response) => {
            const planes = response.data;

            this.fuse.set(Object.keys(planes).reduce(
              (accumulated, next) => [...accumulated, planes[next]],
              [],
            ));

            const results = this.fuse.search(identifier);

            if (!results.length) {
              return null;
            }

            const [{ plane_id }] = results;

            return this.client.get(
              'encyclopedia/planeinfo',
              { plane_id },
              options,
            ).then(detailedResponse => detailedResponse.data[plane_id]);
          }),
        );
      }

      throw new TypeError('Expected a string or number as the plane identifier.');
    });
  }
}

export default Encyclopedia;
