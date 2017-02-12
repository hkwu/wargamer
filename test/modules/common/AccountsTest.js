import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanks from '../../../src/clients/WorldOfTanks';

describe('Accounts', function () {
  before(function () {
    chai.use(chaiAsPromised);
  });

  describe('World of Tanks', function () {
    const client = new WorldOfTanks({
      realm: 'ru',
      applicationId: process.env.APPLICATION_ID,
    });

    describe('#findPlayerId()', function () {
      it('finds exact matches', function () {
        return expect(client.accounts.findPlayerId('straik', 'exact')).to.eventually.equal(73892);
      });

      it('finds fuzzy matches', function () {
        return expect(client.accounts.findPlayerId('salt', 'startswith')).to.eventually.be.instanceof(Array);
      });

      it('throws for invalid search types', function () {
        return expect(client.accounts.findPlayerId('salt', 'false').catch(error => error)).to.eventually.be.instanceof(Error);
      });
    });
  });
});
