import { expect } from 'chai';
import hashCode from '../../src/utils/hashCode';

describe('hashCode()', function() {
  it('hashes strings', function() {
    expect(hashCode('test')).to.be.a('string');
    expect(hashCode('')).to.be.a('string');
  });
});
