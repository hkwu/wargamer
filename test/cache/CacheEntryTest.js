import { expect } from 'chai';
import CacheEntry from '../../src/cache/CacheEntry';

describe('CacheEntry', function() {
  describe('#expired', function() {
    it('correctly determines if the entry is expired', function(done) {
      const nonExpiringEntry = new CacheEntry({ value: 1 });
      const expiringEntry = new CacheEntry({ value: 1, timeToLive: 1 });

      expect(nonExpiringEntry.expired).to.be.false;

      setTimeout(() => {
        expect(nonExpiringEntry.expired).to.be.false;
        expect(expiringEntry.expired).to.be.true;
        done();
      }, 2);
    });
  });

  describe('#touch()', function() {
    it('updates the last accessed time for the entry', function() {
      const entry = new CacheEntry({ value: 1 });
      const now = new Date();

      expect(entry.accessedAt).to.be.null;

      entry.touch();

      expect(entry.accessedAt).to.be.instanceof(Date);
      expect(entry.accessedAt).to.be.at.least(now);
    });
  });
});
