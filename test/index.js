'use strict';

// Load external modules
var Code = require('code');
var Lab = require('lab');

// Load internal modules
var Environment = require('../lib/environment.js');
var HapiJsonView = require('../lib/index.js');

// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('create()', function () {

    it('creates a new environment', function (done) {

        var engine = HapiJsonView.create();

        expect(engine).to.be.an.instanceof(Environment);
        done();
    });
});
