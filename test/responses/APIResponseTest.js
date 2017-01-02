import { expect } from 'chai';
import APIResponse from '../../src/responses/APIResponse';

describe('APIResponse', function() {
  const data = {
    type: 'wot',
    realm: 'na',
    response: {
      data: [],
      meta: 'ok',
    },
    url: 'http://httpbin.org/get',
    method: 'account/list',
  };

  const apiResponse = new APIResponse(data);

  it('correctly constructs itself', function() {
    expect(apiResponse.type).to.equal(data.type);
    expect(apiResponse.realm).to.equal(data.realm);
    expect(apiResponse.url).to.equal(data.url);
    expect(apiResponse.method).to.equal(data.method);
    expect(apiResponse.response).to.deep.equal(data.response);
  });

  it('gets properties properly', function() {
    expect(apiResponse.meta).to.equal(data.response.meta);
    expect(apiResponse.data).to.equal(data.response.data);
  });
});
