import { expect } from 'chai';
import sortObjectByKey from '../../src/utils/sortObjectByKey';

describe('sortObjectByKey()', function() {
  it('sorts object keys', function() {
    expect(JSON.stringify(sortObjectByKey({
      foo: 'bar',
      baz: 'qux',
    }))).to.equal(JSON.stringify({
      baz: 'qux',
      foo: 'bar',
    }));
  });

  it('produces a new object', function() {
    const object = {};

    expect(sortObjectByKey(object)).to.not.equal(object);
  });
});
