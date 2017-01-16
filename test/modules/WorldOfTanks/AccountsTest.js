import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanks from '../../../src/clients/WorldOfTanks';

describe('Accounts', function() {
  const client = new WorldOfTanks({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  before(function() {
    chai.use(chaiAsPromised);
  });

  describe('#findPlayerId()', function() {
    it('finds exact matches', function() {
      return expect(client.accounts.findPlayerId('straik', 'exact', { realm: 'ru' })).to.eventually.equal(73892);
    });

    it('finds fuzzy matches', function() {
      return expect(client.accounts.findPlayerId('salt', 'startswith')).to.eventually.be.instanceof(Array);
    });

    it('throws for invalid search types', function() {
      expect(() => client.accounts.findPlayerId('salt', 'false')).to.throw(Error);
    });
  });
});
