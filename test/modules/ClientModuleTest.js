import 'dotenv/config';
import { expect } from 'chai';
import BaseClient from '../../src/clients/BaseClient';
import ClientModule from '../../src/modules/ClientModule';

describe('ClientModule', function() {
  const client = new BaseClient({
    type: 'wot',
    realm: 'na',
    applicationId: process.env.APPLICATION_ID,
  });

  describe('#constructor()', function() {
    const module = new ClientModule(client, 'test');

    it('generates the proper cache prefix', function() {
      expect(module.cachePrefix).to.equal('wot:test');
    });
  });

  describe('#getCache()', function() {
    const module = new ClientModule(client, 'test');
    const cache = module.createCache('test');

    it('gets existing caches', function() {
      expect(module.getCache('test')).to.equal(cache);
    });

    it('returns undefined for non-existing caches', function() {
      expect(module.getCache('fake')).to.be.undefined;
    });
  });

  describe('#hasCache()', function() {
    const module = new ClientModule(client, 'test');

    module.createCache('test');

    it('returns true for existing caches', function() {
      expect(module.hasCache('test')).to.be.true;
    });

    it('returns false for non-existing caches', function() {
      expect(module.hasCache('fake')).to.be.false;
    });
  });

  describe('#createCache()', function() {
    const module = new ClientModule(client, 'test');

    it('creates a new cache', function() {
      module.createCache('test');

      expect(module.hasCache('test')).to.be.true;

      module.createCache('testWithOptions', { cacheTTL: null });

      expect(module.hasCache('testWithOptions')).to.be.true;
    });

    it('returns the cache created', function() {
      const cache = module.createCache('test');

      expect(module.getCache('test')).to.equal(cache);
    });

    it('does not overwrite existing caches if creation is safe', function() {
      const cache = module.createCache('test');
      const newCache = module.createCache('test');

      expect(cache).to.equal(newCache);
    });

    it('overwrites existing caches if creation is unsafe', function() {
      const cache = module.createCache('test');
      const newCache = module.createCache('test', {}, false);

      expect(cache).to.not.equal(newCache);
    });
  });
});
