import BaseClient from './BaseClient';

/**
 * @classdesc The World of Tanks Console API client.
 * @extends BaseClient
 */
class WorldOfTanksConsole extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wotx' });
  }
}

export default WorldOfTanksConsole;
