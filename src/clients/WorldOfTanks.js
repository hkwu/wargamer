import BaseClient from './BaseClient';

/**
 * @classdesc The World of Tanks API client.
 * @extends BaseClient
 */
export default class WorldOfTanks extends BaseClient {
  constructor(options) {
    super({ ...options, type: 'wot' });
  }
}
