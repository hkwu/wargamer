import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanks from '../../../src/clients/WorldOfTanks';
import WorldOfTanksConsole from '../../../src/clients/WorldOfTanksConsole';

describe('Authentication', function () {
  before(function () {
    chai.use(chaiAsPromised);
  });

  describe('World of Tanks', function () {
    const client = new WorldOfTanks({
      realm: 'na',
      applicationId: process.env.APPLICATION_ID,
    });

    describe('#renewAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', function () {
          return expect(client.authentication.renewAccessToken().catch(error => error)).to.eventually.be.instanceof(Error);
        });
      });
    });

    describe('#destroyAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', function () {
          return expect(client.authentication.destroyAccessToken().catch(error => error)).to.eventually.be.instanceof(Error);
        });
      });
    });
  });

  describe('World of Tanks Console', function () {
    const client = new WorldOfTanksConsole({
      realm: 'xbox',
      applicationId: process.env.APPLICATION_ID,
    });

    describe('#renewAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', function () {
          return expect(client.authentication.renewAccessToken().catch(error => error)).to.eventually.be.instanceof(Error);
        });
      });
    });

    describe('#destroyAccessToken()', function () {
      describe('rejection', function () {
        it('rejects when client access token is not set', function () {
          return expect(client.authentication.destroyAccessToken().catch(error => error)).to.eventually.be.instanceof(Error);
        });
      });
    });
  });
});
