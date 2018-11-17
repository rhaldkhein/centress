'use strict';

module.exports = config => {

  config.path = {};

  // Outer Root
  config.path.root = null;

  // Routes, master will set if not specified
  config.path.routes = null;

  // Modules, master will set if not specified
  config.path.modules = null;

};