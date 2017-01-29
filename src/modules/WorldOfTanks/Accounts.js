import ClientModule from '../ClientModule';

/**
 * @classdesc Module for the World of Tanks Accounts endpoint.
 * @extends ClientModule
 */
class Accounts extends ClientModule {
  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client) {
    super(client, 'accounts');
  }

  /**
   * Searches for player IDs given a nickname. Supports the search types available
   *   on the `account/list` endpoint.
   * @param {string} name - The player's nickname.
   * @param {string} [searchType='exact'] - The search type to use.
   * @returns {Promise.<(Array.<Object>|number|null), Error>} A promise resolving
   *   to the returned search results.
   * If `searchType` is `'startswith'`, the resolved value matches the data returned
   *   by the `account/list` endpoint.
   * If `searchType` is `'exact'`, the resolved value is the matching player's ID,
   *   or `null` if no match was found.
   */
  findPlayerId(name, searchType = 'exact') {
    switch (searchType.toLowerCase()) {
      case 'startswith':
        return this.client.get('account/list', { search: name })
          .then(response => response.data);
      case 'exact':
        return this.client.get('account/list', { search: name })
          .then(response => (response.data[0] ? response.data[0].account_id : null));
      default:
        return Promise.reject(new Error('Invalid search type specified for player search.'));
    }
  }
}

export default Accounts;
