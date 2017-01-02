import BaseClient from './BaseClient';

/**
 * @classdesc The World of Tanks Console API client.
 * @extends BaseClient
 */
export default class WorldOfTanksConsole extends BaseClient {
  constructor(options) {
    super({ ...options, type: 'wotx' });
  }
}
