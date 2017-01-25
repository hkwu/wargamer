import 'dotenv/config';
import { expect } from 'chai';
import APIError from '../../src/errors/APIError';
import WorldOfTanks from '../../src/clients/WorldOfTanks';

describe('APIError', function () {
  describe('#constructor()', function () {
    it('correctly constructs itself', function () {
      const options = {
        client: new WorldOfTanks({ realm: 'na', applicationId: process.env.APPLICATION_ID }),
        statusCode: 200,
        requestRealm: 'na',
        method: 'account/list',
        error: {
          code: 406,
          message: 'INVALID_TOKEN',
          field: 'access_token',
          value: null,
        },
      };

      const apiError = new APIError(options);

      expect(/INVALID_TOKEN/.test(apiError.message)).to.be.true;
      expect(apiError.client).to.equal(options.client);
      expect(apiError.statusCode).to.equal(options.statusCode);
      expect(apiError.requestRealm).to.equal(options.requestRealm);
      expect(apiError.method).to.equal(options.method);
      expect(apiError.code).to.equal(options.error.code);
      expect(apiError.apiMessage).to.equal(options.error.message);
      expect(apiError.field).to.equal(options.error.field);
      expect(apiError.value).to.equal(options.error.value);
    });
  });
});
