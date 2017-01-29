import ClientModule from '../ClientModule';

/**
 * @classdesc Module for Authentication endpoints.
 * @extends ClientModule
 */
class Authentication extends ClientModule {
  /**
   * Constructor.
   * @param {BaseClient} client - The API client this module belongs to.
   */
  constructor(client) {
    super(client, 'authentication');
  }

  /**
   * Sends a request to renew the client's access token. Upon a successful
   *   request, the client's current access token will be updated with the
   *   returned token.
   * @returns {Promise.<APIResponse, Error>} Returns the same value as a normal
   *   request if the client's access token is defined, else rejects with a
   *   plain `Error`.
   */
  renewAccessToken() {
    if (!this.client.accessToken) {
      return Promise.reject(new Error('Failed to renew access token: client\'s access token is not set.'));
    }

    return this.client.post('auth/prolongate', {}, { type: this.client.type === 'wotx' ? 'wotx' : 'wot' })
      .then((response) => {
        this.client.accessToken = response.data.access_token;

        return response;
      });
  }

  /**
   * Sends a request to invalidate the client's access token. Upon a successful
   *   request, the client's current access token will be set to `null`.
   * @returns {Promise.<APIResponse, Error>} Returns the same value as a normal
   *   request if the client's access token is defined, else rejects with a
   *   plain `Error`.
   */
  destroyAccessToken() {
    if (!this.client.accessToken) {
      return Promise.reject(new Error('Failed to invalidate access token: client\'s access token is not set.'));
    }

    return this.client.post('auth/logout', {}, { type: this.client.type === 'wotx' ? 'wotx' : 'wot' })
      .then((response) => {
        this.client.accessToken = null;

        return response;
      });
  }
}

export default Authentication;
