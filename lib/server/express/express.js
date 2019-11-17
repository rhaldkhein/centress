"use strict";

var _express = _interopRequireWildcard(require("express"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var debugServer = (0, _debug["default"])('excore:server');
if (_express.application.useServiceRoutes || _express.application.useApi) throw new Error('Not compatible with express');

_express.application.useServiceRoutes = function () {
  debugServer('using service routes');
  var serverService = this.$provider.service('@server');
  var collection = this.$provider.service('core').collection;
  var services = collection.services;
  services.forEach(function (service) {
    if (service.type === collection.types.SINGLETON) {
      var value = service.value;
      var baseUrl = value.baseUrl || '/' + service.name;

      if (value.api) {
        var appApi = _express["default"].Router();

        value.api(appApi);
        serverService.appApi.use(baseUrl, appApi);
      }

      if (value.page) {
        var pageRouter = _express["default"].Router();

        value.page(pageRouter);
        serverService.appRoot.use(baseUrl, pageRouter);
      }
    }
  });
};

_express.application.useApi = function (config) {
  var serverService = this.$provider.service('@server');
  config(serverService.appApi);
};

_express.application.useApiRoutes = function () {
  var serverService = this.$provider.service('@server');
  serverService.attachApiRoutes();
};