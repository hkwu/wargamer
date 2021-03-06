import Accounts from '../modules/common/Accounts';
import BaseClient from './BaseClient';
import Encyclopedia from '../modules/WorldOfWarplanes/Encyclopedia';

/**
 * @classdesc The World of Warplanes API client.
 * @extends BaseClient
 */
class WorldOfWarplanes extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wowp' });

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

export default WorldOfWarplanes;
