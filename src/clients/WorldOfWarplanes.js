import BaseClient from './BaseClient';

/**
 * @classdesc The World of Warplanes API client.
 * @extends BaseClient
 */
class WorldOfWarplanes extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wowp' });
  }
}

export default WorldOfWarplanes;
