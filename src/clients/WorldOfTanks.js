import BaseClient from './BaseClient';

/**
 * @classdesc The World of Tanks API client.
 * @extends BaseClient
 */
class WorldOfTanks extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wot' });
  }
}

export default WorldOfTanks;
