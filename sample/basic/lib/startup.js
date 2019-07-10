"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureServices = configureServices;
exports.configureApplication = configureApplication;

var _foo = _interopRequireDefault(require("./services/foo"));

var _bar = _interopRequireDefault(require("./services/bar"));

var _yoo = _interopRequireDefault(require("./services/yoo"));

var _baz = _interopRequireDefault(require("./services/baz"));

var _passportLocal = require("passport-local");

var _lib = require("../../../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function configureServices(services) {
  services.singleton(_foo["default"]);
  services.singleton(_bar["default"]);
  services["transient"](_yoo["default"]);
  services.scoped(_baz["default"]);
  services.configure(_lib.Authentication, function () {
    return function (auth) {
      auth.addAuthorize('local', 'local', {
        session: false
      });
      auth.use(new _passportLocal.Strategy(function (username, password, done) {
        var err = new _lib.HttpError();
        err.unauthorized();
        return done(err); // done(null, {
        //   id: 1,
        //   name: 'Foo'
        // })
      }));

      var serializer = function serializer(user, done) {
        return done(null, user);
      };

      auth.serializeUser(serializer);
      auth.deserializeUser(serializer);
    };
  });
}

function configureApplication(app) {
  app.useApi(function (api) {
    api.useAuthentication();
  });
  app.useControllers(); // app.useApiRouter(api => {
  //   api.use((err, req, res, next) => {
  //     res.jsonError().internal()
  //   })
  // })

  app.use(function (err, req, res, next) {
    res.jsonError().badRequest(err);
  });
}