import Accounts from '../modules/common/Accounts';
import BaseClient from './BaseClient';
import Tankopedia from '../modules/WorldOfTanks/Tankopedia';

/**
 * @classdesc The World of Tanks API client.
 * @extends BaseClient
 */
class WorldOfTanks extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wot' });

    /**
     * The client's Accounts module.
     * @type {Accounts}
     */
    this.accounts = new Accounts(this);

    /**
     * The client's Tankopedia module.
     * @type {Tankopedia}
     */
    this.tankopedia = new Tankopedia(this);
  }
}

export default WorldOfTanks;
