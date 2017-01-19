import { expect } from 'chai';
import mapValues from '../../src/utils/mapValues';

describe('mapValues()', function() {
  it('maps object values correctly', function() {
    expect(mapValues({})).to.deep.equal({});

    expect(mapValues({ foo: 'bar' }, value => '')).to.deep.equal({ foo: '' });

    expect(mapValues({
      foo: 'bar',
      baz: 'qux',
    }, value => value.repeat(2))).to.deep.equal({
      foo: 'barbar',
      baz: 'quxqux',
    });
  });

  it('creates a new object', function() {
    const old = {};
    const mapped = mapValues(old);

    expect(old).to.not.equal(mapped);
  });
});
