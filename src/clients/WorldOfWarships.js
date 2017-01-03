import BaseClient from './BaseClient';

/**
 * @classdesc The World of Warships API client.
 * @extends BaseClient
 */
class WorldOfWarships extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wows' });
  }
}

export default WorldOfWarships;
