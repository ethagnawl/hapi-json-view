'use strict';

// Load external modules
var Fs = require('fs');
var Vm = require('vm');

// Load internal modules
var Environment = require('./environment');

// Declare internals
var internals = {};


exports.create = function () {

    return new Environment();
};
