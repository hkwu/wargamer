import { expect } from 'chai';
import CacheMeta from '../../src/cache/CacheMeta';

describe('CacheMeta', function() {
  describe('#hit()', function() {
    it('records a cache hit', function() {
      const meta = new CacheMeta();

      expect(meta.hits).to.equal(0);

      meta.hit();

      expect(meta.hits).to.equal(1);
    });

    it('updates accessed date', function() {
      const meta = new CacheMeta();
      const now = new Date();

      expect(meta.accessedAt).to.be.null;

      meta.hit();

      expect(meta.accessedAt).to.be.at.least(now);
    });
  });

  describe('#miss()', function() {
    it('records a cache miss', function() {
      const meta = new CacheMeta();

      expect(meta.misses).to.equal(0);

      meta.miss();

      expect(meta.misses).to.equal(1);
    });

    it('updates accessed date', function() {
      const meta = new CacheMeta();
      const now = new Date();

      expect(meta.accessedAt).to.be.null;

      meta.miss();

      expect(meta.accessedAt).to.be.at.least(now);
    });
  });

  describe('#expire()', function() {
    it('records a cache expiry', function() {
      const meta = new CacheMeta();

      expect(meta.expired).to.equal(0);

      meta.expire();

      expect(meta.expired).to.equal(1);
    });
  });

  describe('#clear()', function() {
    it('resets the resettable metadata', function() {
      const meta = new CacheMeta();
      const createdAt = meta.createdAt;
      const now = new Date();

      meta.hit();
      meta.miss();
      meta.expire();

      expect(meta.accessedAt).to.be.at.least(now);
      expect(meta.clearedAt).to.be.null;
      expect(meta.hits).to.equal(1);
      expect(meta.misses).to.equal(1);
      expect(meta.expired).to.equal(1);

      const resetAt = new Date();
      meta.clear();

      expect(meta.createdAt).to.equal(createdAt);
      expect(meta.accessedAt).to.be.at.least(now);
      expect(meta.updatedAt).to.be.at.least(now);
      expect(meta.clearedAt).to.be.at.least(resetAt);
      expect(meta.hits).to.equal(0);
      expect(meta.misses).to.equal(0);
      expect(meta.expired).to.equal(0);
    });
  });

  describe('#serialize()', function() {
    it('returns the serialized metadata', function() {
      const meta = new CacheMeta();

      expect(meta.serialize()).to.deep.equal({
        createdAt: meta.createdAt,
        accessedAt: meta.accessedAt,
        updatedAt: meta.updatedAt,
        clearedAt: meta.clearedAt,
        hits: meta.hits,
        misses: meta.misses,
        expired: meta.expired,
      });
    });
  });
});
