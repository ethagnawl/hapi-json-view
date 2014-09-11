'use strict';

// Load external modules
var Fs = require('fs');
var Vm = require('vm');

// Define internals
var internals = {};
internals.partials = {};

internals.json = function() {
  this.content = {};
};

internals.json.prototype.set = function(key, value) {
  if (typeof value === 'function') {
    var json = new internals.json();

    value(json);
    value = json.content;
  }

  this.content[key] = value;
};

internals.json.prototype.extract = function(object, keys) {
  for (var i = 0; i < keys.length; i++) {
    this.content[keys[i]] = object[keys[i]];
  }
};

internals.json.prototype.partial = function (partial, context) {
  context = Vm.createContext(context);
  context.json = this;

  Vm.runInContext(internals.partials[partial], context);
};

exports.registerPartial = function(name, partial) {
  internals.partials[name] = partial;
};

exports.compile = function(string, options, callback) {
  var renderer = function(context, opt, next) {
    context = Vm.createContext(context);
    context.json = new internals.json();

    Vm.runInContext(string, context, options.filename);

    return next(null, JSON.stringify(context.json.content));
  };

  return callback(null, renderer);
};
