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
      return expect(client.tankopedia.findVehicle('m10 wolverine')).to.eventually.have.property('name', 'M10 Wolverine');
    });

    it('finds vehicles by short name', function() {
      return expect(client.tankopedia.findVehicle('centurion ax')).to.eventually.have.property('short_name', 'Centurion AX');
    });

    it('finds vehicles by partial match - long name', function() {
      return expect(client.tankopedia.findVehicle('bat-chatillon')).to.eventually.have.property('name', 'Bat.-Châtillon 25 t');
    });

    it('finds vehicles by partial match - short name', function() {
      return expect(client.tankopedia.findVehicle('vae')).to.eventually.have.property('short_name', 'VAE Type B');
    });

    it('throws for invalid identifier types', function() {
      expect(() => client.tankopedia.findVehicle({})).to.throw(Error);
    });
  });
});
