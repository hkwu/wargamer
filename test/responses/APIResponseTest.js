import 'dotenv/config';
import { expect } from 'chai';
import APIResponse from '../../src/responses/APIResponse';
import WorldOfTanks from '../../src/clients/WorldOfTanks';

describe('APIResponse', function() {
  describe('#constructor()', function() {
    const data = {
      client: new WorldOfTanks({ realm: 'na', applicationId: process.env.APPLICATION_ID }),
      requestRealm: 'na',
      method: 'account/list',
      body: {
        data: [],
        meta: 'ok',
      },
    };

    const apiResponse = new APIResponse(data);

    it('correctly constructs itself', function() {
      expect(apiResponse.client).to.equal(data.client);
      expect(apiResponse.requestRealm).to.equal(data.requestRealm);
      expect(apiResponse.method).to.equal(data.method);
      expect(apiResponse.body).to.deep.equal(data.body);
    });

    it('gets properties properly', function() {
      expect(apiResponse.meta).to.equal(data.body.meta);
      expect(apiResponse.data).to.equal(data.body.data);
    });
  });
});
