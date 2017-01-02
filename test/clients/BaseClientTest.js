import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import APIError from '../../src/errors/APIError';
import APIResponse from '../../src/responses/APIResponse';
import BaseClient from '../../src/clients/BaseClient';

describe('BaseClient', function() {
  it('correctly constructs itself', function() {
    const options = {
      type: 'wot',
      realm: 'na',
      applicationId: 'demo',
    };

    const defaultOptions = new BaseClient(options);

    expect(defaultOptions.type).to.equal(options.type);
    expect(defaultOptions.realm).to.equal(options.realm);
    expect(defaultOptions.applicationId).to.equal(options.applicationId);
    expect(defaultOptions.accessToken).to.be.null;
    expect(defaultOptions.requestMethod).to.equal('POST');
    expect(defaultOptions.baseUri).to.equal('https://api.worldoftanks.com/wot');

    const accessToken = new BaseClient({
      ...options,
      accessToken: 'foo',
    });

    expect(accessToken.type).to.equal(options.type);
    expect(accessToken.realm).to.equal(options.realm);
    expect(accessToken.applicationId).to.equal(options.applicationId);
    expect(accessToken.accessToken).to.equal('foo');
    expect(accessToken.requestMethod).to.equal('POST');
    expect(accessToken.baseUri).to.equal('https://api.worldoftanks.com/wot');

    const requestMethod = new BaseClient({
      ...options,
      requestMethod: 'get',
    });

    expect(requestMethod.type).to.equal(options.type);
    expect(requestMethod.realm).to.equal(options.realm);
    expect(requestMethod.applicationId).to.equal(options.applicationId);
    expect(requestMethod.accessToken).to.be.null;
    expect(requestMethod.requestMethod).to.equal('GET');
    expect(requestMethod.baseUri).to.equal('https://api.worldoftanks.com/wot');
  });

  it('errors for malformed constructor options', function() {
    const badRealm = {
      type: 'wot',
      realm: 'foo',
      applicationId: 'demo',
    };

    expect(() => new BaseClient(badRealm)).to.throw(TypeError);

    const nonStringRealm = {
      type: 'wot',
      realm: 2,
      applicationId: 'demo',
    };

    expect(() => new BaseClient(nonStringRealm)).to.throw(TypeError);

    const nonStringApplicationId = {
      type: 'wot',
      realm: 'na',
      applicationId: 2,
    };

    expect(() => new BaseClient(nonStringApplicationId)).to.throw(TypeError);

    const invalidRequestMethod = {
      type: 'wot',
      realm: 'na',
      applicationId: 'demo',
      requestMethod: 'PATCH',
    };

    expect(() => new BaseClient(invalidRequestMethod)).to.throw(TypeError);
  });

  describe('#fetch()', function() {
    before(function() {
      chai.use(chaiAsPromised);
    });

    describe('fulfillment', function() {
      const client = new BaseClient({
        type: 'wot',
        realm: 'na',
        applicationId: process.env.APPLICATION_ID,
      });

      const accountListSearch = client.fetch('account/list', { search: 'test' });

      it('fulfills with an APIResponse', function() {
        return expect(accountListSearch).to.eventually.be.instanceof(APIResponse);
      });

      it('has required response properties - meta', function() {
        return expect(accountListSearch).to.eventually.have.property('meta');
      });

      it('has required response properties - data', function() {
        return expect(accountListSearch).to.eventually.have.property('data');
      });

      it('works with GET', function() {
        const accountListSearchGet = client.fetch('account/list', {
          search: 'test',
          requestMethod: 'GET',
        });

        return expect(accountListSearchGet).to.eventually.be.instanceof(APIResponse);
      });

      it('overrides default client options as needed', function() {
        const badClient = new BaseClient({
          type: 'wot',
          realm: 'na',
          applicationId: 'lol',
        });

        const overriden = badClient.fetch('account/list', {
          search: 'test',
          application_id: process.env.APPLICATION_ID,
        });

        return expect(overriden).to.eventually.be.instanceof(APIResponse);
      });

      it('trims slashes as needed', function() {
        const accountListSearchSlashes = client.fetch('/account/list/', { search: 'test' });

        return expect(accountListSearchSlashes).to.eventually.be.instanceof(APIResponse);
      });
    });

    describe('rejection', function() {
      const client = new BaseClient({
        type: 'wot',
        realm: 'na',
        applicationId: process.env.APPLICATION_ID,
      });

      const accountListSearchBadApplicationId = client.fetch('account/list', {
        search: 'test',
        application_id: 'foo',
      }).catch(error => error);

      it('rejects with an APIError', function() {
        return expect(accountListSearchBadApplicationId).to.eventually.be.instanceof(APIError);
      });

      it('rejects with an INVALID_APPLICATION_ID error', function() {
        return expect(accountListSearchBadApplicationId.then(error => error.errorMessage)).to.eventually.equal('INVALID_APPLICATION_ID');
      });

      it('rejects and logs the correct API method used', function() {
        return expect(accountListSearchBadApplicationId.then(error => error.method)).to.eventually.equal('account/list');
      });
    });
  });
});
