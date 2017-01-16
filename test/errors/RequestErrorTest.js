import 'dotenv/config';
import { expect } from 'chai';
import RequestError from '../../src/errors/RequestError';
import WorldOfTanks from '../../src/clients/WorldOfTanks';

describe('RequestError', function() {
  describe('#constructor()', function() {
    it('correctly constructs itself', function() {
      const options = {
        message: 'Invalid thing',
        client: new WorldOfTanks({ realm: 'na', applicationId: process.env.APPLICATION_ID }),
        statusCode: 200,
        url: 'http://httpbin.org/get',
      };

      const requestError = new RequestError(options);

      expect(/Invalid thing/.test(requestError.message)).to.be.true;
      expect(requestError.client).to.equal(options.client);
      expect(requestError.statusCode).to.equal(options.statusCode);
      expect(requestError.url).to.equal(options.url);
    });
  });
});
