/**
 * @classdesc Wraps a response from the Wargaming API.
 */
class APIResponse {
  /**
   * Constructor.
   * @param {Object} data - The response data.
   * @param {BaseClient} data.client - The API client that the response originated
   *   from.
   * @param {string} data.requestRealm - The realm of the API that this response
   *   originated from.
   * @param {string} data.method - The name of the method that was used to get
   *   this response data.
   * @param {Object} data.body - The parsed JSON data from the API.
   */
  constructor({ client, requestRealm, method, response }) {
    /**
     * The API client that the response originated from.
     * @type {BaseClient}
     */
    this.client = client;

    /**
     * The realm of the API that this response originated from.
     * @type {string}
     */
    this.requestRealm = requestRealm;

    /**
     * The name of the API method that gave this response.
     * @type {string}
     */
    this.method = method;

    /**
     * The response's parsed JSON data.
     * @type {Object}
     */
    this.body = response;
  }

  /**
   * The value of the meta object returned in the response.
   * @type {Object}
   */
  get meta() {
    return this.body.meta;
  }

  /**
   * The value of the data object returned in the response.
   * @type {Object}
   */
  get data() {
    return this.body.data;
  }
}

export default APIResponse;
