import { expect } from 'chai';
import APIResponse from '../../src/responses/APIResponse';

describe('APIResponse', function() {
  const data = {
    response: {
      data: [],
      meta: 'ok',
    },
    url: 'http://httpbin.org/get',
    method: 'account/list',
  };

  const apiResponse = new APIResponse(data);

  it('correctly constructs itself', function() {
    expect(apiResponse.response).to.deep.equal(data.response);
    expect(apiResponse.url).to.equal(data.url);
    expect(apiResponse.method).to.equal(data.method);
  });

  it('gets properties properly', function() {
    expect(apiResponse.meta).to.equal(data.response.meta);
    expect(apiResponse.data).to.equal(data.response.data);
  });
});
