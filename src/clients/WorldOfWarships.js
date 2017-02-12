import Accounts from '../modules/common/Accounts';
import BaseClient from './BaseClient';
import Encyclopedia from '../modules/WorldOfWarships/Encyclopedia';

/**
 * @classdesc The World of Warships API client.
 * @extends BaseClient
 */
class WorldOfWarships extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wows' });

    /**
     * The client's Accounts module.
     * @type {Accounts}
     */
    this.accounts = new Accounts(this);

    /**
     * The client's Encyclopedia module.
     * @type {Encyclopedia}
     */
    this.encyclopedia = new Encyclopedia(this);
  }
}

export default WorldOfWarships;
