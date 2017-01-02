import BaseClient from './BaseClient';

/**
 * @classdesc The Wargaming.net API client.
 * @extends BaseClient
 */
export default class Wargaming extends BaseClient {
  constructor(options) {
    super({ ...options, type: 'wgn' });
  }
}
