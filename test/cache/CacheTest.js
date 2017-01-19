import { expect } from 'chai';
import Cache from '../../src/cache/Cache';

describe('Cache', function() {
  describe('#size', function() {
    it('correctly gets the cache size', function() {
      const cache = new Cache();

      expect(cache.size).to.equal(0);

      cache.set('foo', 'foo');

      expect(cache.size).to.equal(1);
    });
  });

  describe('#empty', function() {
    it('correctly determines if the cache is empty or not', function() {
      const cache = new Cache();

      expect(cache.empty).to.be.true;

      cache.set('foo', 'foo');

      expect(cache.empty).to.be.false;
    });
  });

  describe('#statistics', function() {
    it('gets statistics correctly', function() {
      const cache = new Cache();
      const { createdAt, ...rest } = cache.statistics;

      expect(createdAt).to.be.below(new Date());
      expect(rest).to.deep.equal({
        accessedAt: null,
        updatedAt: null,
        resetAt: null,
        hits: 0,
        misses: 0,
        expired: 0,
        size: 0,
      });
    });
  });
});
