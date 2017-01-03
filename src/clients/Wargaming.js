import BaseClient from './BaseClient';

/**
 * @classdesc The Wargaming.net API client.
 * @extends BaseClient
 */
class Wargaming extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wgn' });
  }
}

export default Wargaming;
