import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanks from '../../../src/clients/WorldOfTanks';

describe('Tankopedia', function () {
  const client = new WorldOfTanks({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  this.timeout(5000);

  before(function () {
    chai.use(chaiAsPromised);
  });

  describe('#findVehicle()', function () {
    it('finds vehicles by ID', function () {
      return expect(client.tankopedia.findVehicle(6673)).to.eventually.have.property('name', 'Marder II');
    });

    it('finds vehicles by long name', function () {
      return expect(client.tankopedia.findVehicle('m10 wolverine')).to.eventually.have.property('name', 'M10 Wolverine');
    });

    it('finds vehicles by short name', function () {
      return expect(client.tankopedia.findVehicle('centurion ax')).to.eventually.have.property('short_name', 'Centurion AX');
    });

    it('finds vehicles by partial match - long name', function () {
      return expect(client.tankopedia.findVehicle('bat-chatillon')).to.eventually.have.property('name', 'Bat.-Châtillon 25 t');
    });

    it('finds vehicles by partial match - short name', function () {
      return expect(client.tankopedia.findVehicle('vae')).to.eventually.have.property('short_name', 'VAE Type B');
    });

    it('throws for invalid identifier types', function () {
      return expect(client.tankopedia.findVehicle({}).catch(error => error)).to.eventually.be.instanceof(Error);
    });
  });

  describe('#findVehicleProfile()', function () {
    it('finds stock vehicle profiles', function () {
      return expect(client.tankopedia.findVehicleProfile(6673)).to.eventually.have.deep.property('engine.name', 'Maybach HL 57 TR');
    });

    it('finds top vehicle profiles', function () {
      return expect(client.tankopedia.findVehicleProfile(1, 'top')).to.eventually.have.deep.property('gun.name', '76 mm S-54');
    });

    it('finds vehicle profiles by ID', function () {
      return expect(client.tankopedia.findVehicleProfile(1041, '21-1047-2066-4372')).to.eventually.have.deep.property('modules.radio_id', 1047);
    });
  });

  describe('#localizeCrewRole()', function () {
    it('localizes crew roles', function () {
      return expect(client.tankopedia.localizeCrewRole('radioman')).to.eventually.equal('Radio Operator');
    });
  });

  describe('#localizeLanguage()', function () {
    it('localizes languages', function () {
      return expect(client.tankopedia.localizeLanguage('zh-tw')).to.eventually.equal('繁體中文');
    });
  });

  describe('#localizeAchievementSection()', function () {
    it('localizes achievement sections', function () {
      return expect(client.tankopedia.localizeAchievementSection('memorial')).to.eventually.equal('Commemorative Tokens');
    });
  });

  describe('#localizeVehicleType()', function () {
    it('localizes vehicle types', function () {
      return expect(client.tankopedia.localizeVehicleType('AT-SPG')).to.eventually.equal('Tank Destroyer');
    });
  });

  describe('#localizeVehicleNation()', function () {
    it('localizes vehicle types', function () {
      return expect(client.tankopedia.localizeVehicleNation('czech')).to.eventually.equal('Czechoslovakia');
    });
  });
});
