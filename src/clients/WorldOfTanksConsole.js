import Accounts from '../modules/common/Accounts';
import BaseClient from './BaseClient';
import Tankopedia from '../modules/WorldOfTanksConsole/Tankopedia';

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

export default WorldOfTanksConsole;
