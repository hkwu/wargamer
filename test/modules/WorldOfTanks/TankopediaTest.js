import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanks from '../../../src/clients/WorldOfTanks';

describe('Tankopedia', function() {
  const client = new WorldOfTanks({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  before(function() {
    chai.use(chaiAsPromised);
  });

  describe('#findVehicle()', function() {
    it('finds vehicles by ID', function() {
      return expect(client.tankopedia.findVehicle(6673)).to.eventually.have.property('name', 'Marder II');
    });

    it('finds vehicles by long name', function() {
      return expect(client.tankopedia.findVehicle('wolverine')).to.eventually.have.property('name', 'M10 Wolverine');
    });

    it('finds vehicles by short name', function() {
      return expect(client.tankopedia.findVehicle('centurion ax')).to.eventually.have.property('name', 'Centurion Action X');
    });

    it('throws for invalid identifier types', function() {
      expect(() => client.tankopedia.findVehicle({})).to.throw(Error);
    });
  });
});
