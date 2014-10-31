'use strict';

// Load external modules
var Vm = require('vm');

// Declare internals
var internals = {};


exports = module.exports = internals.runtime = function (helpers, partials) {

    this.content = {};
    this.helpers = helpers || {};
    this.partials = partials || {};
};


internals.runtime.prototype.set = function (/* key, value | value */) {

    var key = arguments.length === 2 ? arguments[0] : null;
    var value = arguments.length === 2 ? arguments[1] : arguments[0];

    if (typeof value === 'function') {
        var runtime = new internals.runtime(this.helpers, this.partials);

        value(runtime);
        value = runtime.content;
    }

    if (key) {
        this.content[key] = value;
    }
    else {
        this.content = value;
    }
};


internals.runtime.prototype.array = function (items, callback) {

    var self = this;
    var result = [];

    items.forEach(function (item) {

        var runtime = new internals.runtime(self.helpers, self.partials);
        callback(runtime, item);

        result.push(runtime.content);
    });

    return result;
};


internals.runtime.prototype.extract = function (object, keys) {

    for (var i = 0; i < keys.length; i++) {
        this.content[keys[i]] = object[keys[i]];
    }
};


internals.runtime.prototype.helper = function (name /* , args */) {

    var args = Array.prototype.slice.call(arguments, 1);
    return this.helpers[name].apply(null, args);
};


internals.runtime.prototype.partial = function (name, context) {

    context = Vm.createContext(context);
    context.json = new internals.runtime(this.helpers, this.partials);

    Vm.runInContext(this.partials[name], context);
    return context.json.content;
};


internals.runtime.prototype.run = function (string, context) {

    context = Vm.createContext(context);
    context.json = this;

    Vm.runInContext(string, context);
    return context.json.content;
};
