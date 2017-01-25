import BaseClient from './BaseClient';
import Tankopedia from '../modules/WorldOfTanksBlitz/Tankopedia';

/**
 * @classdesc The World of Tanks Blitz API client.
 * @extends BaseClient
 */
class WorldOfTanksBlitz extends BaseClient {
  /**
   * Constructor.
   * @param {ClientOptions} options - The client options.
   */
  constructor(options) {
    super({ ...options, type: 'wotb' });

    /**
     * The client's Tankopedia module.
     * @type {Tankopedia}
     */
    this.tankopedia = new Tankopedia(this);
  }
}

export default WorldOfTanksBlitz;
