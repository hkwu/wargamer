import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanksConsole from '../../../src/clients/WorldOfTanksConsole';

describe('Tankopedia', function () {
  const client = new WorldOfTanksConsole({
    realm: 'xbox',
    applicationId: process.env.APPLICATION_ID,
  });

  this.timeout(0);

  before(function () {
    chai.use(chaiAsPromised);
  });

  describe('#findVehicle()', function () {
    it('finds vehicles by ID', function () {
      return expect(client.tankopedia.findVehicle(6673)).to.eventually.have.property('name', 'Marder II');
    });

    it('finds vehicles by long name', function () {
      return expect(client.tankopedia.findVehicle('vk 30.01 (h)')).to.eventually.have.property('name', 'VK 30.01 (H)');
    });

    it('finds vehicles by short name', function () {
      return expect(client.tankopedia.findVehicle('medium i')).to.eventually.have.property('short_name', 'Medium I');
    });

    it('finds vehicles by partial match - long name', function () {
      return expect(client.tankopedia.findVehicle('Type 98')).to.eventually.have.property('name', 'Type 98 Ke-Ni');
    });

    it('finds vehicles by partial match - short name', function () {
      return expect(client.tankopedia.findVehicle('t1 heav')).to.eventually.have.property('short_name', 'T1 Heavy');
    });

    it('throws for invalid identifier types', function () {
      return expect(client.tankopedia.findVehicle({}).catch(error => error)).to.eventually.be.instanceof(Error);
    });
  });

  describe('#localizeAchievementSection()', function () {
    it('localizes achievement sections', function () {
      return expect(client.tankopedia.localizeAchievementSection('memorial')).to.eventually.equal('Commemorative Tokens');
    });
  });

  describe('#localizeVehicleType()', function () {
    it('localizes vehicle types', function () {
      return expect(client.tankopedia.localizeVehicleType('AT-SPG')).to.eventually.equal('Tank Destroyers');
    });
  });

  describe('#localizeVehicleNation()', function () {
    it('localizes vehicle types', function () {
      return expect(client.tankopedia.localizeVehicleNation('china')).to.eventually.equal('China');
    });
  });
});
