import EventEmitter from 'events';
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
 * @param {string} [language=null] - The default localization language
 *   to use for API responses.
 */

/**
 * The options available to use when making a single request.
 * @typedef {Object} RequestOptions
 * @property {string} [type] - The API to send this request to. One of: `wot`,
 *   `wotb`, `wotx`, `wows`, `wowp`, `wgn`.
 * @property {string} [realm] - The realm/region to use for the request.
 *   One of: `ru`, `eu`, `na`, `kr`, `asia`, `xbox`, `ps4`.
 * @property {string} [language] - The localization language to use for the
 *   request results. Check the API reference for valid languages.
 */

/**
 * Emitted when a client request is successful.
 * @event BaseClient#requestFulfilled
 * @param {APIResponse} response - The response object.
 */

/**
 * Emitted when a client request is rejected.
 * @event BaseClient#requestRejected
 * @param {RequestError} error - The error object.
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
 * @extends EventEmitter
 */
class BaseClient extends EventEmitter {
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
   * @throws {TypeError} Thrown if options are not well-formed.
   */
  constructor({ type, realm, applicationId, accessToken = null, language = null }) {
    super();

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
   * Sends a GET request to the API.
   * @param {string} method - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   * @throws {TypeError} Thrown if any parameters are not the right type.
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
   * @throws {TypeError} Thrown if any parameters are not the right type.
   */
  post(method, params = {}, options = {}) {
    return this.request(method, params, { ...options, method: 'POST' });
  }

  /**
   * Sends a request to renew the client's access token. Upon a successful
   *   request, the client's current access token will be updated with the
   *   returned token.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<APIResponse, Error>} Returns the same value as a normal
   *   request if the client's access token is defined, else rejects with a
   *   plain `Error`.
   */
  renewAccessToken(options = {}) {
    if (!this.accessToken) {
      return Promise.reject(new Error('Failed to renew access token: client\'s access token is not set.'));
    }

    return this.post('auth/prolongate', {}, {
      ...options,
      type: this.type === 'wotx' ? 'wotx' : 'wot',
    }).then((response) => {
      this.accessToken = response.data.access_token;

      return response;
    });
  }

  /**
   * Sends a request to invalidate the client's access token. Upon a successful
   *   request, the client's current access token will be set to `null`.
   * @param {RequestOptions} [options={}] - The options for the request.
   * @returns {Promise.<APIResponse, Error>} Returns the same value as a normal
   *   request if the client's access token is defined, else rejects with a
   *   plain `Error`.
   */
  destroyAccessToken(options = {}) {
    if (!this.accessToken) {
      return Promise.reject(new Error('Failed to invalidate access token: client\'s access token is not set.'));
    }

    return this.post('auth/logout', {}, {
      ...options,
      type: this.type === 'wotx' ? 'wotx' : 'wot',
    }).then((response) => {
      this.accessToken = null;

      return response;
    });
  }

  /**
   * Fetches data from an endpoint method.
   * @param {string} apiMethod - The method to request.
   * @param {Object} [params={}] - The parameters to include in the request.
   * @param {RequestOptions} [options={}] - Options used to override client defaults.
   * @returns {Promise.<APIResponse, Error>} Returns a promise resolving to the
   *   returned API data, or rejecting with an error.
   * @throws {TypeError} Thrown if any parameters are not the right type.
   * @fires BaseClient#requestFulfilled
   * @fires BaseClient#requestRejected
   * @private
   */
  request(apiMethod, params = {}, options = {}) {
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

    const fulfill = (response) => {
      const { error = null } = response.body;

      if (error) {
        // Wargaming API error
        throw new APIError({
          client: this,
          statusCode: response.status,
          url: response.req.url,
          method: normalizedApiMethod,
          error,
        });
      }

      const apiResponse = new APIResponse({
        client: this,
        requestRealm: normalizedRealm,
        url: response.req.url,
        method: normalizedApiMethod,
        response: response.body,
      });

      this.emit('requestFulfilled', apiResponse);

      return apiResponse;
    };

    const reject = (value) => {
      // check if this is a HTTP error or a Wargaming error
      if (value instanceof APIError) {
        this.emit('requestRejected', value);

        throw value;
      }

      const { response: { error, req } } = value;

      const requestError = new RequestError({
        message: value.response.error.message,
        client: this,
        statusCode: error.status,
        url: req.url,
      });

      this.emit('requestRejected', requestError);
      throw requestError;
    };

    switch (method) {
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
        // we should never get here
        return Promise.reject(new Error('Received invalid request method.'));
    }
  }
}

export default BaseClient;
