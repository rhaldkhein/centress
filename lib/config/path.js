'use strict';

module.exports = function (config) {
  config.paths = {}; // Outer Root

  config.paths.root = null; // Modules, master will set if not specified

  config.paths.modules = null; // Module configs

  config.paths.moduleConfigs = null;
};