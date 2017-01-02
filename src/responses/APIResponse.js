/**
 * @classdesc Wraps a response from the Wargaming API.
 */
export default class APIResponse {
  /**
   * Constructor.
   * @param {Object} data - The response data.
   * @param {string} data.type - The type of the request this response corresponds to.
   * @param {string} data.realm - The realm of the request this response corresponds to.
   * @param {string} data.url - The URL of the request this response corresponds to.
   * @param {string} data.method - The name of the method that was used to get
   *   this response data.
   * @param {Object} data.response - The parsed JSON data from the API.
   */
  constructor({ type, realm, url, method, response }) {
    /**
     * The type of the API that this response came from.
     * @type {string}
     */
    this.type = type;

    /**
     * The realm of the request this response corresponds to.
     * @type {string}
     */
    this.realm = realm;

    /**
     * The URL of the request this response corresponds to.
     * @type {string}
     */
    this.url = url;

    /**
     * The name of the API method that gave this response.
     * @type {string}
     */
    this.method = method;

    /**
     * The response's parsed JSON data.
     * @type {Object}
     */
    this.response = response;
  }

  /**
   * The value of the meta object returned in the response.
   * @type {Object}
   */
  get meta() {
    return this.response.meta;
  }

  /**
   * The value of the data object returned in the response.
   * @type {Object}
   */
  get data() {
    return this.response.data;
  }
}
