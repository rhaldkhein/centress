"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var prod = process.env.NODE_ENV === 'production';
var defaultCode = 'INTERNAL_ERROR';
var defaultMessage = 'Something went wrong';
var defaultStatus = 500;

var HttpError =
/*#__PURE__*/
function (_Error) {
  _inherits(HttpError, _Error);

  function HttpError(res) {
    var _this;

    _classCallCheck(this, HttpError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HttpError).call(this, defaultMessage));

    _defineProperty(_assertThisInitialized(_this), "code", defaultCode);

    _defineProperty(_assertThisInitialized(_this), "status", defaultStatus);

    _this.res = res;
    return _this;
  }

  _createClass(HttpError, [{
    key: "send",
    value: function send(opt) {
      if (typeof opt === 'string') opt = {
        message: opt
      };else opt = opt || {};
      if (opt.message) this.message = opt.message;
      if (opt.status) this.status = opt.status;
      if (opt.code) this.code = opt.code;
      if (opt.payload) this.payload = opt.payload;
      if (opt.meta) this.meta = opt.meta;

      if (this.res) {
        this.res.status(this.status).json({
          error: {
            code: this.code,
            message: prod ? null : this.message
          },
          meta: this.meta,
          payload: this.payload
        });
      }
    } // 400

  }, {
    key: "badRequest",
    value: function badRequest(o) {
      this.status = 400;
      this.code = 'BAD_REQUEST';
      this.message = 'Something is wrong with the request';
      this.send(o);
    }
  }, {
    key: "unauthorized",
    value: function unauthorized(o) {
      this.status = 401;
      this.code = 'UNAUTHORIZED';
      this.message = 'A valid authentication is required';
      this.send(o);
    }
  }, {
    key: "forbidden",
    value: function forbidden(o) {
      this.status = 403;
      this.code = 'FORBIDDEN';
      this.message = 'Client is not allowed to request';
      this.send(o);
    }
  }, {
    key: "notFound",
    value: function notFound(o) {
      this.status = 404;
      this.code = 'NOT_FOUND';
      this.message = 'Did not find anything matching the request';
      this.send(o);
    }
  }, {
    key: "conflict",
    value: function conflict(o) {
      this.status = 409;
      this.code = 'CONFLICT';
      this.message = 'Could not be completed due to a conflict';
      this.send(o);
    }
  }, {
    key: "validation",
    value: function validation(o) {
      this.status = 400;
      this.code = 'VALIDATION';
      this.message = 'The form contains invalid fields';
      this.send(o);
    } // 500

  }, {
    key: "internal",
    value: function internal(o) {
      this.status = defaultStatus;
      this.code = defaultCode;
      this.message = defaultMessage;
      this.send(o);
    }
  }, {
    key: "unavailable",
    value: function unavailable(o) {
      this.status = 503;
      this.code = 'UNAVAILABLE';
      this.message = 'Request is currently unavailable';
      this.send(o);
    }
  }, {
    key: "notImplemented",
    value: function notImplemented(o) {
      this.status = 501;
      this.code = 'NOT_IMPLEMENTED';
      this.message = 'Functionality not supported yet';
      this.send(o);
    }
  }]);

  return HttpError;
}(_wrapNativeSuper(Error));

exports["default"] = HttpError;