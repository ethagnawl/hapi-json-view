'use strict';

// Load external modules
var Code = require('code');
var Lab = require('lab');

// Load internal modules
var Runtime = require('../lib/runtime');

// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var expect = Code.expect;


describe('set()', function () {

    it('sets the value if key is not provided', function (done) {

        var json = new Runtime();
        json.set('example');

        expect(json.content).to.equal('example');
        done();
    });

    it('executes and sets the value if key is not provided and value is a function', function (done) {

        var json = new Runtime();
        json.set(function (json) {

            json.set('example');
        });

        expect(json.content).to.equal('example');
        done();
    });

    it('sets the value if key is provided', function (done) {

        var json = new Runtime();
        json.set('test', 'example');

        expect(json.content).to.deep.equal({test: 'example'});
        done();
    });

    it('executes and sets the value if key is provided and value is a function', function (done) {

        var json = new Runtime();
        json.set('test', function (json) {

            json.set('example');
        });

        expect(json.content).to.deep.equal({ test: 'example' });
        done();
    });
});


describe('array()', function () {

    it('creates an array with a primitive', function (done) {

        var json = new Runtime();
        json.set('test', json.array(['one', 'two'], function (json, item) {

            json.set(item);
        }));

        expect(json.content).to.deep.equal({ test: ['one', 'two'] });
        done();
    });

    it('creates an array with an object', function (done) {

        var json = new Runtime();
        json.set('test', json.array(['one', 'two'], function (json, item) {

            json.set('item', item);
        }));

        expect(json.content).to.deep.equal({ test: [{ item: 'one' }, { item: 'two' }] });
        done();
    });

    it('creates an array without a key', function (done) {

        var json = new Runtime();
        json.set(json.array(['one', 'two'], function (json, item) {

            json.set(item);
        }));

        expect(json.content).to.deep.equal(['one', 'two']);
        done();
    });
});


describe('extract()', function () {

    it('extracts values', function (done) {

        var json = new Runtime();
        var object = { one: 'one', two: 'two', three: 'three', four: 'four' };
        json.extract(object, ['two', 'three']);

        expect(json.content).to.deep.equal({ two: 'two', three: 'three' });
        done();
    });
});


describe('helper()', function () {

    it('calls the helper function', function (done) {

        var helper = function (text) {

            return text.toUpperCase();
        };

        var json = new Runtime({ uppercase: helper });
        json.set('test', json.helper('uppercase', 'example'));

        expect(json.content).to.deep.equal({ test: 'EXAMPLE' });
        done();
    });
});


describe('partial()', function () {

    it('renders the partial', function (done) {

        var json = new Runtime(null, { author: 'json.set(\'name\', author.name)' });
        json.set('author', json.partial('author', { author: { name: 'example' } }));

        expect(json.content).to.deep.equal({ author: { name: 'example' } });
        done();
    });
});


describe('run()', function () {

    it('runs the runtime', function (done) {

        var runtime = new Runtime();
        var result = runtime.run('json.set(\'name\', author.name)', { author: { name: 'example' } });

        expect(result).to.deep.equal({ name: 'example' });
        done();
    });
});
