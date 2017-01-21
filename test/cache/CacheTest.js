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

  describe('#keys', function() {
    it ('correctly gets the keys in the cache', function() {
      const cache = new Cache();

      expect(cache.keys).to.deep.equal([]);

      cache.set('foo', 'bar');

      expect(cache.keys).to.deep.equal(['foo']);

      cache.set('bar', 'baz');

      expect(cache.keys).to.deep.equal(['foo', 'bar']);
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
      const now = new Date();
      const cache = new Cache();
      const { createdAt, ...rest } = cache.statistics;

      expect(createdAt).to.be.at.least(now);
      expect(rest).to.deep.equal({
        accessedAt: null,
        updatedAt: null,
        clearedAt: null,
        hits: 0,
        misses: 0,
        expired: 0,
        size: 0,
      });
    });
  });

  describe('#get()', function() {
    it('returns cached keys', function() {
      const cache = new Cache();

      cache.set('foo', 23);

      expect(cache.get('foo')).to.equal(23);
    });

    it('returns undefined for non-cached keys', function() {
      const cache = new Cache();

      expect(cache.get('foo')).to.be.undefined;
    });

    it('returns undefined for expired keys', function(done) {
      const cache = new Cache({ timeToLive: 1 });

      cache.set('foo', 'bar');

      setTimeout(() => {
        expect(cache.get('foo')).to.be.undefined;
        done();
      }, 2);
    });

    it('updates the cache meta for a hit', function() {
      const cache = new Cache();

      cache.set('foo', 23);
      cache.get('foo');

      expect(cache.statistics.hits).to.equal(1);
    });

    it('updates the cache meta for a miss', function() {
      const cache = new Cache();

      cache.get('foo');

      expect(cache.statistics.misses).to.equal(1);
    });

    it('updates the cache meta for an expired key', function(done) {
      const cache = new Cache({ timeToLive: 1 });

      cache.set('foo', 'bar');

      setTimeout(() => {
        cache.get('foo');
        expect(cache.statistics.expired).to.equal(1);
        done();
      }, 2);
    });
  });

  describe('#set()', function() {
    it('sets a key', function() {
      const cache = new Cache();

      cache.set('foo', 'bar');

      expect(cache.get('foo')).to.equal('bar');
    });
  });

  describe('#delete()', function() {
    it('deletes a key', function() {
      const cache = new Cache();

      cache.set('foo', 'bar');

      expect(cache.get('foo')).to.equal('bar');

      cache.delete('foo');

      expect(cache.get('foo')).to.be.undefined;
    });
  });

  describe('#clear()', function() {
    it('clears the data in the cache', function() {
      const cache = new Cache();

      cache.set('foo', 23);
      cache.set('bar', 23);
      cache.set('baz', 23);
      cache.set('qux', 23);

      expect(cache.size).to.equal(4);

      cache.clear();

      expect(cache.size).to.equal(0);
      expect(cache.get('foo')).to.be.undefined;
    });

    it('clears the metadata in the cache', function() {
      const cache = new Cache();

      cache.set('foo', 23);
      cache.set('bar', 23);
      cache.set('baz', 23);
      cache.set('qux', 23);

      cache.get('foo');
      cache.get('bar');
      cache.get('baz');
      cache.get('qux');
      cache.get('foobar');

      expect(cache.statistics.hits).to.equal(4);
      expect(cache.statistics.misses).to.equal(1);

      cache.clear();

      expect(cache.statistics.hits).to.equal(0);
      expect(cache.statistics.misses).to.equal(0);
    });
  });
});
