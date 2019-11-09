"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireWildcard(require("http"));

var _lodash = _interopRequireDefault(require("lodash.defaultsdeep"));

var _debug = _interopRequireDefault(require("debug"));

var _error = require("./error");

require("./express/express");

require("./express/response");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prod = process.env.NODE_ENV === 'production';
var debugServer = (0, _debug["default"])('excore:server');
var debugRouter = (0, _debug["default"])('excore:router');

var Server =
/*#__PURE__*/
function () {
  function Server(provider, options) {
    var _this = this;

    _classCallCheck(this, Server);

    _defineProperty(this, "config", {});

    _defineProperty(this, "defaults", {
      apiBaseUrl: '/api',
      port: 3000
    });

    this.core = provider.service('core'); // Create app instances

    this.appRoot = (0, _express["default"])();
    this.http = _http["default"].Server(this.appRoot);
    this.appApi = (0, _express["default"])(); // Attach provider to apps

    this.appRoot.$provider = provider;
    this.appApi.$provider = provider; // Apply configs

    this.config = (0, _lodash["default"])({}, typeof options === 'function' ? options(this) : options, this.defaults); // First middleware. Attach scoped provider.

    this.appRoot.use(function (req, res, next) {
      debugRouter(req.method + ' ' + req.url); // Attache new scoped provider

      req.provider = _this.core.createProvider();
      next();
    });
    debugServer('created');
  } // Invoked after configure


  _createClass(Server, [{
    key: "listen",
    value: function listen() {
      var _this2 = this;

      debugServer('starting http'); // Infuse di container to request

      this.appRoot.use(this.core.init(_http.IncomingMessage.prototype)); // Attach primary routers

      this.appRoot.use(this.config.apiBaseUrl, this.appApi); // Last middleware

      this.appApi.use(function (req, res) {
        res.jsonError().notFound('Route not found');
      }); // Catch and flush error for API
      // eslint-disable-next-line no-unused-vars

      this.appApi.use(function (err, req, res, next) {
        if (err instanceof _error.AppError) {
          return err.send(res);
        }

        res.jsonError().internal(prod ? null : err.message);
        debugServer('error', err);
      });

      var listenServer = function listenServer() {
        return new Promise(function (resolve, reject) {
          var port = _this2.config.port;

          _this2.http.listen(port, function (err) {
            if (err) return reject(err);
            debugServer('started at port %d', port);
            resolve();
          });
        });
      };

      return Promise.resolve().then(listenServer);
    }
  }]);

  return Server;
}();

exports["default"] = Server;

_defineProperty(Server, "service", '@server');