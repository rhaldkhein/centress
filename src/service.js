'use strict';

let path = global.__SYNTRESS__.config.path.services;

// Retreive service instance
module.exports.get = name => require(path + '/' + name);