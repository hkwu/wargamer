import Cache from 'stale-lru-cache';
import request from 'superagent';
import APIError from '../errors/APIError';
import APIResponse from '../responses/APIResponse';
import Authentication from '../modules/common/Authentication';
import RequestError from '../errors/RequestError';
import hashCode from '../utils/hashCode';
import mapValues from '../utils/mapValues';
import sortObjectByKey from '../utils/sortObjectByKey';

/**
 * The options available to use on a client constructor.
 * @typedef {Object} ClientOptions
 * @property {string} realm - The realm/region this client is for.
 * @property {string} applicationId - The application ID of this client.
 * @property {string} [accessToken=null] - The access token for this client,
 *   if it will be using one.
 * @param {string} [language=null] - The default localization language
 *   to use for API responses.
 * @param {?number} [options.cacheTimeToLive=600] - The time to live in seconds
 *   for the client's data cache entries. `null` if no there is no TTL.
 * @param {?number} [options.cacheMaxSize=250] - The max number of entries in
 *   the client's data cache.
 */

/**
 * The options available to use when making a single request.
 * @typedef {Object} RequestOptions
 * @property {string} [type] - The API to send this request to. One of: `wot`,
 *   `wotb`, `wotx`, `wows`, `wowp`, `wgn`.
 * @property {string} [realm] - The realm/region to use for the request.
 *   One of: `ru`, `eu`, `na`, `kr`, `asia`, `xbox`, `ps4`.
 */

/**
 * Mapping between realms and their TLDs.
 * @type {Object}
 * @constant
 * @private
 */
const REALM_TLD = {
  ru: 'ru',
  eu: 'eu',
  na: 'com',
  kr: 'kr',
  asia: 'asia',
  xbox: 'xbox',
  ps4: 'ps4',
};

/**
 * Functions which generate the base URIs for various APIs.
 * @type {Object}
 * @constant
 * @private
 */
const BASE_URI = {
  wot: realm => `https://api.worldoftanks.${REALM_TLD[realm]}/wot`,
  wotb: realm => `https://api.wotblitz.${REALM_TLD[realm]}/wotb`,
  wotx: realm => `https://api-${REALM_TLD[realm]}-console.worldoftanks.com/wotx`,
  wows: realm => `https://api.worldofwarships.${REALM_TLD[realm]}/wows`,
  wowp: realm => `https://api.worldofwarplanes.${REALM_TLD[realm]}/wowp`,
  wgn: realm => `https://api.worldoftanks.${REALM_TLD[realm]}/wgn`,
};

/**
 * Returns the base URI for a given realm and API type.
 * @param {string} realm - The realm/region of the server.
 * @param {string} type - The desired API.
 * @returns {string} The base URI for the API that was specified.
 * @throws {Error} Thrown if the given `realm` or `type` don't exist.
 * @private
 */
const getBaseUri = (realm, type) => {
  if (!REALM_TLD[realm] || !BASE_URI[type]) {
    throw new Error('Unknown realm or type given.');
  }

  return BASE_URI[type](realm);
};

/**
 * @classdesc The base API client.
 */
class BaseClient {
  /**
   * The default time to live for cache entries, in seconds.
   * @type {number}
   * @static
   * @const
   * @private
   */
  static DEFAULT_CACHE_TTL = 600;

  /**
   * The default size of the cache.
   * @type {number}
   * @static
   * @const
   * @private
   */
  static DEFAULT_CACHE_SIZE = 250;

  /**
   * Constructor.
   * @param {Object} options - The client options.
   * @param {string} options.type - The type of API this client is for.
   * @param {string} options.realm - The realm/region this client is for.
   * @param {string} options.applicationId - The application ID of this client.
   * @param {string} [options.accessToken=null] - The access token for this
   *   client, if it will be using one.
   * @param {string} [options.language=null] - The default localization language
   *   to use for API responses.
   * @param {?number} [options.cacheTimeToLive=600] - The time to live in seconds
   *   for the client's data cache entries. `null` if no there is no TTL.
   * @param {?number} [options.cacheMaxSize=250] - The max number of entries in
   *   the client's data cache.
   * @throws {TypeError} Thrown if options are not well-formed.
   */
  constructor(options) {
    const {
      type,
      realm,
      applicationId,
      accessToken = null,
      language = null,
      cacheTimeToLive = this.constructor.DEFAULT_CACHE_TTL,
      cacheMaxSize = this.constructor.DEFAULT_CACHE_SIZE,
    } = options;

    if (typeof realm !== 'string' || !REALM_TLD[realm.toLowerCase()]) {
      throw new TypeError('Must specify a valid realm for the client.');
    } else if (typeof applicationId !== 'string') {
      throw new TypeError('Must specify an application ID for the client.');
    }

    const normalizedRealm = realm.toLowerCase();

    /**
     * The type of API this client is for.
     * @type {string}
     */
    this.type = type;

    /**
     * The realm, i.e. region of this client.
     * @type {string}
     */
    this.realm = normalizedRealm;

    /**
     * The application ID for this client.
     * @type {string}
     */
    this.applicationId = applicationId;

    /**
     * The access token for this client.
     * @type {?string}
     */
    this.accessToken = accessToken;

    /**
     * The default localization language for this client.
     * @type {?string}
     */
    this.language = language;

    /**
     * The client's Authentication module.
     * @type {Authentication}
     */
    this.authentication = new Authentication(this);

    /**
     * The base API URI for this client.
     * @type {string}
     * @private
     */
    this.baseUri = getBaseUri(normalizedRealm, type);

    /**
     * The API response cache.
     * @type {Cache}
     * @private
     */
    this.cache = new Cache({
      maxAge: cacheTimeToLive,
      staleWhileRevalidate: 300,
      maxSize: cacheMaxSize,
    });
  }

  /**
   * Normalizes a given parameter type so the API can consume it.
   * @param {*} parameter - The parameter to normalize.
   * @returns {*} The normalized parameter.
   * @static
   * @private
   */
  static normalizeParameterValue(parameter) {
    if (Array.isArray(parameter)) {
      return parameter.join(',');
    } else if (parameter instanceof Date) {
      return parameter.toISOString();
    }

    return parameter;
  }

  /**
   * Sends a GET request to the API.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   */
  get(method, params = {}, options = {}) {
    return this.request(method, params, { ...options, method: 'GET' });
  }

  /**
   * Sends a POST request to the API.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   */
  post(method, params = {}, options = {}) {
    return this.request(method, params, { ...options, method: 'POST' });
  }

  /**
   * Fetches data from an endpoint method.
   * @param {string} apiMethod - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   * @private
   */
  request(apiMethod, params = {}, options = {}) {
    return new Promise((resolve) => {
      const { type = this.type, realm = this.realm, method = 'GET' } = options;

      if (typeof apiMethod !== 'string') {
        throw new TypeError('Expected API method to be a string.');
      }

      const normalizedApiMethod = apiMethod.toLowerCase();
      const normalizedRealm = realm.toLowerCase();

      // construct the request URL
      const baseUrl = normalizedRealm === this.realm
        ? this.baseUri
        : getBaseUri(normalizedRealm, type);
      const requestUrl = `${baseUrl}/${normalizedApiMethod.replace(/^\/*(.+?)\/*$/, '$1')}/`;

      // construct the payload
      const payload = {
        application_id: this.applicationId,
        access_token: this.accessToken,
        language: this.language,
        ...params,
      };

      const normalizedPayload = mapValues(payload, this.constructor.normalizeParameterValue);

      // compute information for the cache
      const { application_id, ...rest } = normalizedPayload; // eslint-disable-line no-unused-vars
      const cacheKey = hashCode(`${requestUrl}${JSON.stringify(sortObjectByKey(rest))}`);

      const fulfillResponse = (response) => {
        const { error = null } = response.body;

        if (error) {
          // Wargaming API error
          throw new APIError({
            client: this,
            statusCode: response.status,
            method: normalizedApiMethod,
            error,
          });
        }

        return new APIResponse({
          client: this,
          requestRealm: normalizedRealm,
          method: normalizedApiMethod,
          body: response.body,
        });
      };

      const rejectResponse = (value) => {
        // check if this is a HTTP error or a Wargaming error
        if (value instanceof Error) {
          throw value;
        }

        const { response: { error } } = value;

        throw new RequestError({
          message: value.body.error.message,
          client: this,
          statusCode: error.status,
        });
      };

      if (method === 'GET') {
        const cached = this.cache.get(cacheKey);

        if (cached) {
          const response = new APIResponse({
            client: this,
            requestRealm: normalizedRealm,
            method: normalizedApiMethod,
            body: cached,
          });

          resolve(response);
        }

        const promise = request.get(requestUrl)
          .query(normalizedPayload)
          .then(fulfillResponse)
          .then((apiResponse) => {
            this.cache.set(cacheKey, apiResponse.body, {
              revalidate: (key, callback) => {
                this.request(apiMethod, params, options)
                  .then((revalidateResponse) => {
                    callback(null, revalidateResponse.body);
                  })
                  .catch(callback);
              },
            });

            return apiResponse;
          })
          .catch(rejectResponse);

        resolve(promise);
      } else if (method === 'POST') {
        const promise = request.post(requestUrl)
          .type('form')
          .send(normalizedPayload)
          .then(fulfillResponse)
          .catch(rejectResponse);

        resolve(promise);
      }

      // we should never get here
      throw new Error('Received invalid request method.');
    });
  }
}

export default BaseClient;
