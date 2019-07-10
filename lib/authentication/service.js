"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _debug = _interopRequireDefault(require("debug"));

require("./express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debugAuth = (0, _debug["default"])('excore:authentication');

var isEmpty = function isEmpty(obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
};

var Authentication =
/*#__PURE__*/
function () {
  function Authentication(provider, configure) {
    var _this = this;

    _classCallCheck(this, Authentication);

    _defineProperty(this, "authorizeList", {});

    _defineProperty(this, "defaultAuthorize", null);

    _defineProperty(this, "isInit", false);

    _defineProperty(this, "initialize", function (o) {
      _this.isInit = true;
      return _passport["default"].initialize(o);
    });

    _defineProperty(this, "session", function (o) {
      return _passport["default"].session(o);
    });

    _defineProperty(this, "use", function (n, s) {
      return _passport["default"].use(n, s);
    });

    _defineProperty(this, "unuse", function (n) {
      return _passport["default"].unuse(n);
    });

    _defineProperty(this, "framework", function (w) {
      return _passport["default"].framework(w);
    });

    _defineProperty(this, "serializeUser", function (f, r, d) {
      return _passport["default"].serializeUser(f, r, d);
    });

    _defineProperty(this, "deserializeUser", function (f, r, d) {
      return _passport["default"].deserializeUser(f, r, d);
    });

    _defineProperty(this, "transformAuthInfo", function (f, r, d) {
      return _passport["default"].transformAuthInfo(f, r, d);
    });

    if (configure) configure(this);
    debugAuth('created');
  }

  _createClass(Authentication, [{
    key: "addAuthorize",
    value: function addAuthorize(name, strategy, options, callback) {
      this.authorizeList[name] = [strategy, options, callback];
      if (!this.defaultAuthorize) this.defaultAuthorize = name;
    }
  }, {
    key: "authorize",
    value: function authorize(strategy, options, callback) {
      // Do not use authorize, return a noop middleware
      if (!this.isInit) return function (q, s, n) {
        return n();
      }; // Resolving arguments

      if (_typeof(strategy) === 'object') {
        callback = options;
        options = strategy;
        strategy = null;
      }

      var auth = null; // Check from authorize list

      if (!isEmpty(this.authorizeList)) auth = this.authorizeList[strategy || this.defaultAuthorize]; // Auth from list or fallback to passport

      if (auth) return _passport["default"].authenticate(auth[0], auth[1], auth[2]);else return _passport["default"].authenticate(strategy || this.defaultAuthorize, options, callback);
    }
    /**
     * Passport proxies and overrides
     * 
     * n = name, s = strategy, w = framework, o = options
     * c = callback, f = function, r = request, d = done
     */
    // Override
    // Might not need to proxy these
    // authorize = (s, o, c) => passport.authorize(s, o, c)
    // authenticate = (s, o, c) => passport.authenticate(s, o, c)

  }]);

  return Authentication;
}();

exports["default"] = Authentication;

_defineProperty(Authentication, "service", '@authentication');