import ExtendableError from 'es6-error';

/**
 * @classdesc Generic API client error encountered during requests.
 */
export default class RequestError extends ExtendableError {
  /**
   * Constructor.
   * @param {Object} options - The constructor options.
   * @param {string} options.message - The error message.
   * @param {number} options.statusCode - The HTTP status code of the request.
   * @param {string} options.url - The URL that the request was for.
   */
  constructor({ message, statusCode, url }) {
    super(message);

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
