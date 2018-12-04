'use strict';

const Fs = require('fs');
const Keyfob = require('../lib');

const MockFS = require('mock-fs');
const lab = exports.lab = require('lab').script();
const before = lab.beforeEach;
const after = lab.afterEach;
const describe = lab.experiment;
const it = lab.test;
const expect = require('code').expect;

describe('load()', () => {

  before((done) => {

    MockFS({
      '/text': {
        'one.txt': 'file one',
        'missing.bak': 'should not exist',
        nested: {
          'two.txt': 'file two',
          deeply: {
            'three.txt': 'file three'
          }
        },
        neighbor: {
          'four.txt': 'file four'
        }
      },
      '/json': {
        'one.json': JSON.stringify({ name: 'one' }),
        nested: {
          'two.json': JSON.stringify({ name: 'two' }),
          deeply: {
            'three.json': JSON.stringify({ name: 'three' })
          }
        },
        neighbor: {
          'four.json': JSON.stringify({ name: 'four' })
        }
      }
    });

    return done();
  });

  after((done) => {

    MockFS.restore();
    return done();
  });

  it('can read text files with default fn', (done) => {

    const results = Keyfob.load({ path: '/text' });
    expect(results).to.equal({
      one: 'file one',
      missing: 'should not exist',
      nested: {
        two: 'file two',
        deeply: {
          three: 'file three'
        }
      },
      neighbor: {
        four: 'file four'
      }
    });

    return done();
  });

  it('respects the includes list', (done) => {

    const results = Keyfob.load({ path: '/text', includes: ['**/*.txt'] });
    expect(results).to.equal({
      one: 'file one',
      nested: {
        two: 'file two',
        deeply: {
          three: 'file three'
        }
      },
      neighbor: {
        four: 'file four'
      }
    });

    return done();
  });

  it('respects the excludes list', (done) => {

    const results = Keyfob.load({ path: '/text', excludes: ['**/*.bak'] });
    expect(results).to.equal({
      one: 'file one',
      nested: {
        two: 'file two',
        deeply: {
          three: 'file three'
        }
      },
      neighbor: {
        four: 'file four'
      }
    });

    return done();
  });

  it('can use an alternate function', (done) => {

    const fn = function (path) {

      return JSON.parse(Fs.readFileSync(path, 'utf8'));
    };

    const results = Keyfob.load({ path: '/json', fn: fn });
    expect(results).to.equal({
      one: { name: 'one' },
      nested: {
        two: { name: 'two' },
        deeply: {
          three: { name: 'three' }
        }
      },
      neighbor: {
        four: { name: 'four' }
      }
    });

    return done();
  });
});
