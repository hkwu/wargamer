import RequestError from './RequestError';

/**
 * @classdesc Error received from Wargaming's API.
 */
export default class APIError extends RequestError {
  /**
   * Constructor.
   * @param {Object} options - The constructor options.
   * @param {number} options.statusCode - The HTTP status code of the request.
   * @param {string} options.url - The URL that the request was for.
   * @param {string} options.method - The API method that the request was for.
   * @param {Object} options.error - The error object returned from the API.
   * @param {number} options.error.code - The Wargaming API error code.
   * @param {string} options.error.message - The wargaming API error message.
   * @param {string} options.error.field - The Wargaming API error field.
   * @param {*} options.error.value - The Wargaming API error field value.
   */
  constructor({ method, error, ...rest }) {
    const { code, message, field, value } = error;

    super({
      ...rest,
      message: `${code}: ${message}. Error field: ${field} => ${value}.`,
    });

    /**
     * The API method that the request was for.
     * @type {string}
     */
    this.method = method;

    /**
     * The Wargaming API error code.
     * @type {number}
     */
    this.code = code;

    /**
     * The field which was flagged in the error.
     * @type {string}
     */
    this.field = field;

    /**
     * The value of the field which was flagged in the error.
     * @type {*}
     */
    this.value = value;
  }
}
