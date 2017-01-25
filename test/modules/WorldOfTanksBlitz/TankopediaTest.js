import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfTanksBlitz from '../../../src/clients/WorldOfTanksBlitz';

describe('Tankopedia', function () {
  const client = new WorldOfTanksBlitz({
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

    it('finds vehicles by name', function () {
      return expect(client.tankopedia.findVehicle('m10 wolverine')).to.eventually.have.property('name', 'M10 Wolverine');
    });

    it('finds vehicles by partial name match', function () {
      return expect(client.tankopedia.findVehicle('universal carrier')).to.eventually.have.property('name', 'Universal Carrier 2-pdr');
    });

    it('throws for invalid identifier types', function () {
      return expect(client.tankopedia.findVehicle({}).catch(error => error)).to.eventually.be.instanceof(Error);
    });
  });

  describe('#localizeLanguage()', function () {
    it('localizes languages', function () {
      return expect(client.tankopedia.localizeLanguage('zh-tw')).to.eventually.equal('繁體中文');
    });
  });

  describe('#localizeAchievementSection()', function () {
    it('localizes achievement sections', function () {
      return expect(client.tankopedia.localizeAchievementSection('commemorative')).to.eventually.equal('Commemorative Tokens');
    });
  });

  describe('#localizeVehicleType()', function () {
    it('localizes vehicle types', function () {
      return expect(client.tankopedia.localizeVehicleType('AT-SPG')).to.eventually.equal('Tank Destroyer');
    });
  });

  describe('#localizeVehicleNation()', function () {
    it('localizes vehicle types', function () {
      return expect(client.tankopedia.localizeVehicleNation('ussr')).to.eventually.equal('U.S.S.R.');
    });
  });
});
