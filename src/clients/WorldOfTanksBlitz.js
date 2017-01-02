import BaseClient from './BaseClient';

/**
 * @classdesc The World of Tanks Blitz API client.
 * @extends BaseClient
 */
export default class WorldOfTanksBlitz extends BaseClient {
  constructor(options) {
    super({ ...options, type: 'wotb' });
  }
}
