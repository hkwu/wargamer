import request from 'superagent';
import APIError from '../errors/APIError';
import APIResponse from '../responses/APIResponse';
import RequestError from '../errors/RequestError';

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
 * Valid request methods for the Wargaming API.
 * @type {Set.<string>}
 * @constant
 */
const VALID_REQUEST_METHODS = new Set(['GET', 'POST']);

/**
 * Mapping between realms and their TLDs.
 * @type {Object}
 * @constant
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
 */
export const getBaseUri = (realm, type) => {
  if (!REALM_TLD[realm] || !BASE_URI[type]) {
    throw new Error();
  }

  return BASE_URI[type](realm);
};

/**
 * @classdesc The base API client.
 */
export default class BaseClient {
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
    if (!realm) {
      throw new TypeError('Must specify a realm for the client.');
    } else if (!applicationId) {
      throw new TypeError('Must specify an application ID for the client.');
    } else if (!BaseClient.isValidRequestMethod(requestMethod)) {
      throw new TypeError('Must specify a valid request method.');
    }

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
    this.realm = realm;

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
    this.requestMethod = requestMethod;

    /**
     * The base API URI for this client.
     * @type {string}
     * @private
     */
    this.baseUri = getBaseUri(realm, type);
  }

  /**
   * Checks if a request method is available for the client.
   * @param {string} method - The request method.
   * @returns {boolean} True if the method is valid for the client.
   * @throws {TypeError} Thrown if the given request method is not a string.
   * @static
   */
  static isValidRequestMethod(method) {
    if (typeof method !== 'string') {
      throw new TypeError('Given request method must be a string.');
    }

    return VALID_REQUEST_METHODS.has(method.toUpperCase());
  }

  /**
   * Fetches data from an endpoint method.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {string} [requestMethod] - The request method to use.
   * @returns {Promise.<Object, Error>} Returns a promise resolving to the returned
   *   API data, or rejecting with an error.
   */
  fetch(method, params = {}, requestMethod = this.requestMethod) {
    if (typeof method !== 'string') {
      throw new TypeError('Expected method to be a string.');
    } else if (!BaseClient.isValidRequestMethod(requestMethod)) {
      throw new TypeError('Must specify a valid request method.');
    }

    const normalizedMethod = method.toLowerCase();
    const requestUrl = `${this.baseUri}/${normalizedMethod.replace(/^\/*(.+?)\/*$/, '$1')}/`;
    const data = { application_id: this.applicationId, ...params };
    const payload = this.accessToken ? { access_token: this.accessToken, ...data } : data;

    const success = (response) => {
      const { error = null } = response.body;

      if (error) {
        // Wargaming API error
        throw new APIError({
          statusCode: response.status,
          url: response.request.url,
          method: normalizedMethod,
          error,
        });
      }

      return new APIResponse({
        response: response.body,
        url: response.request.url,
        method: normalizedMethod,
      });
    };

    const failure = (value) => {
      // check if this is a HTTP error or a Wargaming error
      if (value instanceof APIError) {
        throw value;
      }

      const { response: { error, request: req } } = value;

      throw new RequestError({
        message: value.response.error.message,
        statusCode: error.status,
        url: req.url,
      });
    };

    switch (requestMethod) {
      case 'GET':
        return request.get(requestUrl)
          .query(payload)
          .then(success)
          .catch(failure);
      case 'POST':
        return request.post(requestUrl)
          .type('form')
          .send(payload)
          .then(success)
          .catch(failure);
      default:
        // we should never get here anyways
        return Promise.reject(new Error('Received invalid request method.'));
    }
  }
}
