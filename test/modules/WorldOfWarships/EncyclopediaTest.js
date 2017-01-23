import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfWarships from '../../../src/clients/WorldOfWarships';

describe('Encyclopedia', function() {
  const client = new WorldOfWarships({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  // need to wait quite a bit when the API response is not cached
  this.timeout(5000);

  before(function() {
    chai.use(chaiAsPromised);
  });

  describe('#findShip()', function() {
    it('finds ships by ID', function() {
      return expect(client.encyclopedia.findShip(3522082512)).to.eventually.have.property('name', 'ARP Nachi');
    });

    it('finds ships by name', function() {
      return expect(client.encyclopedia.findShip('kongo')).to.eventually.have.property('name', 'Kongo');
    });

    it('finds ships by partial name match', function() {
      return expect(client.encyclopedia.findShip('spite')).to.eventually.have.property('name', 'Warspite');
    });

    it('throws for invalid identifier types', function() {
      return expect(client.encyclopedia.findShip({}).catch(error => error)).to.eventually.be.instanceof(Error);
    });
  });

  describe('#localizeShipType()', function() {
    it('localizes ship types', function() {
      return expect(client.encyclopedia.localizeShipType('AirCarrier')).to.eventually.equal('Aircraft Carrier');
    });
  });

  describe('#localizeLanguage()', function() {
    it('localizes languages', function() {
      return expect(client.encyclopedia.localizeLanguage('zh-tw')).to.eventually.equal('繁體中文');
    });
  });

  describe('#localizeShipModification()', function() {
    it('localizes ship modifications', function() {
      return expect(client.encyclopedia.localizeShipModification('PCM026_LookoutStation_Mod_I')).to.eventually.equal('Target Acquisition System Modification 1');
    });
  });

  describe('#localizeShipModule()', function() {
    it('localizes ship modules', function() {
      return expect(client.encyclopedia.localizeShipModule('TorpedoBomber')).to.eventually.equal('Torpedo Bombers');
    });
  });

  describe('#localizeShipNation()', function() {
    it('localizes ship nations', function() {
      return expect(client.encyclopedia.localizeShipNation('pan_asia')).to.eventually.equal('Pan-Asia');
    });
  });
});
