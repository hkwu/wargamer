import BaseClient from './BaseClient';

/**
 * @classdesc The World of Warships API client.
 * @extends BaseClient
 */
export default class WorldOfWarships extends BaseClient {
  constructor(options) {
    super({ ...options, type: 'wows' });
  }
}
