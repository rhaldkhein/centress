"use strict";

var _express = _interopRequireWildcard(require("express"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var debugServer = (0, _debug["default"])('excore:server');
if ('useApi' in _express.application || 'useApiRoutes' in _express.application || 'useServiceRoutes' in _express.application) throw new Error('Not compatible with express');

function applyRouter(baseRouter, targetFn, baseUrl, provider, name) {
  var router = _express["default"].Router();

  var res = targetFn(router, provider, {
    name: name
  });
  if (res && res.then) return res.then(function () {
    return baseRouter.use(baseUrl, router);
  });
  baseRouter.use(baseUrl, router);
  return Promise.resolve();
}

_express.application.useServiceRoutes = function () {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  debugServer('using service routes');
  var serverService = this.$provider.service('@server');
  var collection = this.$provider.service('core').collection;
  var services = collection.services;
  var excludes = options.excludes || [];
  var promises = [];

  var _loop = function _loop(i) {
    var _services$i = services[i],
        name = _services$i.name,
        type = _services$i.type,
        value = _services$i.value;

    if (type === collection.types.SINGLETON) {
      // Exclude specified services
      if (excludes.indexOf(name) > -1) return "continue"; // Apply routers to services

      var baseUrl = value.baseUrl || '/' + name;
      var prom = Promise.resolve(value).then(function (value) {
        if (!value.api) return value;
        return applyRouter(serverService.appApi, value.api, baseUrl, _this.$provider, name).then(function () {
          return value;
        });
      }).then(function (value) {
        if (!value.page) return value;
        return applyRouter(serverService.appRoot, value.page, baseUrl, _this.$provider, name).then(function () {
          return value;
        });
      });
      promises.push(prom);
    }
  };

  for (var i = 0; i < services.length; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }

  return Promise.all(promises);
};

_express.application.useApi = function (config) {
  var serverService = this.$provider.service('@server');
  config(serverService.appApi);
};

_express.application.useApiRoutes = function () {
  var serverService = this.$provider.service('@server');
  serverService.attachApiRoutes();
};