import { expect } from 'chai';
import APIResponse from '../../src/responses/APIResponse';
import WorldOfTanks from '../../src/clients/WorldOfTanks';

describe('APIResponse', function() {
  describe('#constructor()', function() {
    const data = {
      client: new WorldOfTanks({ realm: 'na', applicationId: 'demo' }),
      requestRealm: 'na',
      url: 'http://httpbin.org/get',
      method: 'account/list',
      response: {
        data: [],
        meta: 'ok',
      },
    };

    const apiResponse = new APIResponse(data);

    it('correctly constructs itself', function() {
      expect(apiResponse.client).to.equal(data.client);
      expect(apiResponse.requestRealm).to.equal(data.requestRealm);
      expect(apiResponse.url).to.equal(data.url);
      expect(apiResponse.method).to.equal(data.method);
      expect(apiResponse.response).to.deep.equal(data.response);
    });

    it('gets properties properly', function() {
      expect(apiResponse.meta).to.equal(data.response.meta);
      expect(apiResponse.data).to.equal(data.response.data);
    });
  });
});
