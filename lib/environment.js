'use strict';

// Load internal modules
var Runtime = require('./runtime');

// Declare internals
var internals = {};


exports = module.exports = internals.environment = function () {

    this.helpers = {};
    this.partials = {};
};


internals.environment.prototype.registerHelper = function (name, helper) {

    this.helpers[name] = helper;
};


internals.environment.prototype.registerPartial = function (name, partial) {

    this.partials[name] = partial;
};


internals.environment.prototype.compile = function (string, options, callback) {

    var self = this;

    var renderer = function (context, opt, next) {

        var runtime = new Runtime(self.module.helpers, self.module.partials);
        var result = runtime.run(string, context, options);

        return next(null, JSON.stringify(result));
    };

    return callback(null, renderer);
};
