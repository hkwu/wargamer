import { expect } from 'chai';
import APIError from '../../src/errors/APIError';

describe('APIError', function() {
  it('correctly constructs itself', function() {
    const options = {
      statusCode: 200,
      url: 'http://httpbin.org/get',
      method: 'account/list',
      error: {
        code: 406,
        message: 'INVALID_TOKEN',
        field: 'access_token',
        value: null,
      },
    };

    const apiError = new APIError(options);

    expect(apiError.statusCode).to.equal(options.statusCode);
    expect(apiError.url).to.equal(options.url);
    expect(apiError.method).to.equal(options.method);
    expect(/INVALID_TOKEN/.test(apiError.message)).to.be.true;
    expect(apiError.code).to.equal(options.error.code);
    expect(apiError.apiMessage).to.equal(options.error.message);
    expect(apiError.field).to.equal(options.error.field);
    expect(apiError.value).to.equal(options.error.value);
  });
});
