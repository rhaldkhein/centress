'use strict';

module.exports = config => {

  config.paths = {};

  // Outer Root
  config.paths.root = null;

  // Routes, master will set if not specified
  config.paths.routes = null;

  // Modules, master will set if not specified
  config.paths.modules = null;

};