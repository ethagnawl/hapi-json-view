'use strict';

// Load external modules
var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Path = require('path');

// Load internal modules
var Environment = require('../lib/environment');
var HapiJsonView = require('../lib/index.js');

// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var expect = Code.expect;


describe('registerHelper()', function () {

    it('register the helper', function (done) {

        var environment = new Environment();
        environment.registerHelper('uppercase', function () { });

        expect(environment.helpers).to.include('uppercase');
        done();
    });
});


describe('registerPartial()', function () {

    it('registers the partial', function (done) {

        var environment = new Environment();
        environment.registerPartial('author', 'json.set(\'name\', author.name);');

        expect(environment.partials).to.include('author');
        done();
    });
});


describe('compile()', function () {

    it('renders a template', function (done) {

        var server = new Hapi.Server({ debug: { request: ['error'] } });
        server.views({
            engines: {
                tmpl: {
                    module: HapiJsonView.create(),
                    compileMode: 'async'
                }
            },
            path: Path.join(__dirname, 'templates'),
            helpersPath: Path.join(__dirname, 'templates/helpers'),
            partialsPath: Path.join(__dirname, 'templates/partials')
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {

                var article = { title: 'example' };
                var author = { name: 'example' };

                reply.view('article.tmpl', { article: article, author: author });
            }
        });

        server.inject('/', function (res) {

            expect(res.statusCode).to.equal(200);
            expect(res.result).to.equal('{"title":"EXAMPLE","author":{"name":"example"}}');
            done();
        });
    });
});
