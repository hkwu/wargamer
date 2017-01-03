import ExtendableError from 'es6-error';

/**
 * @classdesc Generic API client error encountered during requests.
 * @extends ExtendableError
 */
class RequestError extends ExtendableError {
  /**
   * Constructor.
   * @param {Object} options - The constructor options.
   * @param {string} options.message - The error message.
   * @param {BaseClient} options.client - The API client that the error originated
   *   from.
   * @param {number} options.statusCode - The HTTP status code of the request.
   * @param {string} options.url - The URL that the request was for.
   */
  constructor({ message, client, statusCode, url }) {
    super(message);

    /**
     * The API client that the error originated from.
     * @type {BaseClient}
     */
    this.client = client;

    /**
     * The HTTP status code of the request.
     * @type {number}
     */
    this.statusCode = statusCode;

    /**
     * The URL of the request.
     * @type {string}
     */
    this.url = url;
  }
}

export default RequestError;
