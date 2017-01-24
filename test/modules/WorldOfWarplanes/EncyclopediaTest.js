import 'dotenv/config';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WorldOfWarplanes from '../../../src/clients/WorldOfWarplanes';

describe('Encyclopedia', function() {
  const client = new WorldOfWarplanes({
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  before(function() {
    chai.use(chaiAsPromised);
  });

  describe('#findPlane()', function() {
    it('finds planes by ID', function() {
      return expect(client.encyclopedia.findPlane(2702)).to.eventually.have.property('name_i18n', 'Ilyushin IL-8');
    });

    it('finds planes by name', function() {
      return expect(client.encyclopedia.findPlane('grumman f2f')).to.eventually.have.property('name_i18n', 'Grumman F2F');
    });

    it('finds planes by partial name match', function() {
      return expect(client.encyclopedia.findPlane('p-40')).to.eventually.have.property('name_i18n', 'Curtiss P-40 Warhawk');
    });

    it('throws for invalid identifier types', function() {
      return expect(client.encyclopedia.findPlane({}).catch(error => error)).to.eventually.be.instanceof(Error);
    });
  });
});
