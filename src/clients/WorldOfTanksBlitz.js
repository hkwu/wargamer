import BaseClient from './BaseClient';

/**
 * @classdesc The World of Tanks Blitz API client.
 * @extends BaseClient
 */
class WorldOfTanksBlitz extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wotb' });
  }
}

export default WorldOfTanksBlitz;
