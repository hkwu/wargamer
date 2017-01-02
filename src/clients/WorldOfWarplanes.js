import BaseClient from './BaseClient';

/**
 * @classdesc The World of Warplanes API client.
 * @extends BaseClient
 */
export default class WorldOfWarplanes extends BaseClient {
  constructor(options) {
    super({ ...options, type: 'wowp' });
  }
}
