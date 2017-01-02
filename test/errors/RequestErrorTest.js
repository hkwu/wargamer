import { expect } from 'chai';
import RequestError from '../../src/errors/RequestError';

describe('RequestError', function() {
  it('correctly constructs itself', function() {
    const options = {
      message: 'Invalid thing',
      statusCode: 200,
      url: 'http://httpbin.org/get',
    };

    const requestError = new RequestError(options);

    expect(requestError.statusCode).to.equal(options.statusCode);
    expect(requestError.url).to.equal(options.url);
    expect(/Invalid thing/.test(requestError.message)).to.be.true;
  });
});
