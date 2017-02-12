import Accounts from '../modules/common/Accounts';
import BaseClient from './BaseClient';

/**
 * @classdesc The Wargaming.net API client.
 * @extends BaseClient
 */
class Wargaming extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wgn' });

    /**
     * The client's Accounts module.
     * @type {Accounts}
     */
    this.accounts = new Accounts(this);
  }
}

export default Wargaming;
