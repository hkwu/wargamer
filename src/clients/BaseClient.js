import request from 'superagent';
import APIError from '../errors/APIError';
import APIResponse from '../responses/APIResponse';
import RequestError from '../errors/RequestError';
import mapValues from '../utils/mapValues';

/**
 * The options available to use on a client constructor.
 * @typedef {Object} ClientOptions
 * @property {string} realm - The realm/region this client is for.
 * @property {string} applicationId - The application ID of this client.
 * @property {string} [accessToken=null] - The access token for this client,
 *   if it will be using one.
 * @property {string} [requestMethod='POST'] - The default request method for
 *   this client.
 */

/**
 * The options available to use when making a single request.
 * @typedef {Object} RequestOptions
 * @property {string} [realm] - The realm/region to use for the request.
 * @property {string} [requestMethod] - The method to use for the request.
 */

/**
 * Valid request methods for the Wargaming API.
 * @type {Set.<string>}
 * @constant
 * @private
 */
const VALID_REQUEST_METHODS = new Set(['GET', 'POST']);

/**
 * Checks if a request method is valid.
 * @param {string} method - The request method.
 * @returns {boolean} True if the method is valid.
 * @throws {TypeError} Thrown if the given request method is not a string.
 * @private
 */
const isValidRequestMethod = (method) => {
  if (typeof method !== 'string') {
    throw new TypeError('Given request method must be a string.');
  }

  return VALID_REQUEST_METHODS.has(method.toUpperCase());
};

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
    throw new Error();
  }

  return BASE_URI[type](realm);
};

/**
 * @classdesc The base API client.
 */
class BaseClient {
  /**
   * Constructor.
   * @param {Object} options - The client options.
   * @param {string} options.type - The type of API this client is for.
   * @param {string} options.realm - The realm/region this client is for.
   * @param {string} options.applicationId - The application ID of this client.
   * @param {string} [options.accessToken=null] - The access token for this
   *   client, if it will be using one.
   * @param {string} [options.requestMethod='POST'] - The default request method
   *   for this client.
   * @throws {TypeError} Thrown if options are not well-formed.
   */
  constructor({ type, realm, applicationId, accessToken = null, requestMethod = 'POST' }) {
    if (typeof realm !== 'string' || !REALM_TLD[realm.toLowerCase()]) {
      throw new TypeError('Must specify a valid realm for the client.');
    } else if (typeof applicationId !== 'string') {
      throw new TypeError('Must specify an application ID for the client.');
    } else if (!isValidRequestMethod(requestMethod)) {
      throw new TypeError('Must specify a valid request method.');
    }

    const normalizedRealm = realm.toLowerCase();
    const normalizedRequestMethod = requestMethod.toUpperCase();

    /**
     * The type of API this client is for.
     * @type {string}
     * @private
     */
    this.type = type;

    /**
     * The realm, i.e. region of this client.
     * @type {string}
     * @private
     */
    this.realm = normalizedRealm;

    /**
     * The application ID for this client.
     * @type {string}
     * @private
     */
    this.applicationId = applicationId;

    /**
     * The access token for this client.
     * @type {?string}
     * @private
     */
    this.accessToken = accessToken;

    /**
     * The default request method to use. One of `'GET'` or `'POST'`.
     * @type {string}
     * @private
     */
    this.requestMethod = normalizedRequestMethod;

    /**
     * The base API URI for this client.
     * @type {string}
     * @private
     */
    this.baseUri = getBaseUri(normalizedRealm, type);
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
   * Fetches data from an endpoint method.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<Object, Error>} Returns a promise resolving to the returned
   *   API data, or rejecting with an error.
   * @throws {TypeError} Thrown if any parameters are not the right type.
   */
  fetch(method, params = {}, options = {}) {
    const { realm = this.realm, requestMethod = this.requestMethod } = options;

    if (typeof method !== 'string') {
      throw new TypeError('Expected method to be a string.');
    } else if (!isValidRequestMethod(requestMethod)) {
      throw new TypeError('Must specify a valid request method.');
    }

    const normalizedMethod = method.toLowerCase();
    const normalizedRequestMethod = requestMethod.toUpperCase();
    const normalizedRealm = realm.toLowerCase();

    // construct the request URL
    const baseUrl = normalizedRealm === this.realm
      ? this.baseUri
      : getBaseUri(normalizedRealm, this.type);
    const requestUrl = `${baseUrl}/${normalizedMethod.replace(/^\/*(.+?)\/*$/, '$1')}/`;

    // construct the payload
    const payload = {
      application_id: this.applicationId,
      access_token: this.accessToken,
      ...params,
    };

    const normalizedPayload = mapValues(payload, this.constructor.normalizeParameterValue);

    const fulfill = (response) => {
      const { error = null } = response.body;

      if (error) {
        // Wargaming API error
        throw new APIError({
          client: this,
          statusCode: response.status,
          url: response.req.url,
          method: normalizedMethod,
          error,
        });
      }

      return new APIResponse({
        client: this,
        requestRealm: normalizedRealm,
        url: response.req.url,
        method: normalizedMethod,
        response: response.body,
      });
    };

    const reject = (value) => {
      // check if this is a HTTP error or a Wargaming error
      if (value instanceof APIError) {
        throw value;
      }

      const { response: { error, req } } = value;

      throw new RequestError({
        message: value.response.error.message,
        client: this,
        statusCode: error.status,
        url: req.url,
      });
    };

    switch (normalizedRequestMethod) {
      case 'GET':
        return request.get(requestUrl)
          .query(normalizedPayload)
          .then(fulfill)
          .catch(reject);
      case 'POST':
        return request.post(requestUrl)
          .type('form')
          .send(normalizedPayload)
          .then(fulfill)
          .catch(reject);
      default:
        // we should never get here anyways
        return Promise.reject(new Error('Received invalid request method.'));
    }
  }
}

export default BaseClient;
