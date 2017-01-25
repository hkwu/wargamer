import 'dotenv/config';
import { expect } from 'chai';
import BaseClient from '../../src/clients/BaseClient';
import ClientModule from '../../src/modules/ClientModule';

describe('ClientModule', function () {
  const client = new BaseClient({
    type: 'wot',
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  describe('#constructor()', function () {
    const module = new ClientModule(client, 'test');

    it('constructs the module correctly', function () {
      expect(module.client).to.equal(client);
      expect(module.name).to.equal('test');
    });
  });
});
