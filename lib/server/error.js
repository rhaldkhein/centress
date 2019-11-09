"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.badRequest = badRequest;
exports.unauthorized = unauthorized;
exports.forbidden = forbidden;
exports.notFound = notFound;
exports.conflict = conflict;
exports.alreadyExists = alreadyExists;
exports.validation = validation;
exports.internal = internal;
exports.notImplemented = notImplemented;
exports.unavailable = unavailable;
exports.invalidArguments = invalidArguments;
exports.AppError = void 0;

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

var prod = process.env.NODE_ENV === 'production';

var AppError =
/*#__PURE__*/
function (_Error) {
  _inherits(AppError, _Error);

  function AppError(payload, meta) {
    var _this;

    var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Something went wrong';
    var status = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
    var code = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'INTERNAL';

    _classCallCheck(this, AppError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AppError).call(this, message));
    _this.code = code;
    _this.status = status;
    _this.payload = payload;
    _this.meta = meta;
    return _this;
  }

  _createClass(AppError, [{
    key: "send",
    value: function send(res) {
      res.status(this.status).json({
        error: {
          code: this.code,
          message: prod ? null : this.message
        },
        meta: this.meta,
        payload: this.payload
      });
    }
  }]);

  return AppError;
}(_wrapNativeSuper(Error)); // 400


exports.AppError = AppError;

function badRequest(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Bad request';
  return new AppError(payload, meta, msg, 400, 'BAD_REQUEST');
}

function unauthorized(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Not authorized';
  return new AppError(payload, meta, msg, 401, 'UNAUTHORIZED');
}

function forbidden(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Not allowed';
  return new AppError(payload, meta, msg, 403, 'FORBIDDEN');
}

function notFound(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Not found';
  return new AppError(payload, meta, msg, 404, 'NOT_FOUND');
}

function conflict(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Conflict';
  return new AppError(payload, meta, msg, 409, 'CONFLICT');
}

function alreadyExists(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Already exists';
  return conflict(payload, meta, msg);
}

function validation(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Validation';
  return new AppError(payload, meta, msg, 400, 'VALIDATION');
} // 500


function internal(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Internal';
  return new AppError(payload, meta, msg, 500, 'INTERNAL');
}

function notImplemented(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Not implemented';
  return new AppError(payload, meta, msg, 501, 'NOT_IMPLEMENTED');
}

function unavailable(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Unavailable';
  return new AppError(payload, meta, msg, 503, 'UNAVAILABLE');
}

function invalidArguments(payload, meta) {
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Invalid arguments';
  return new AppError(payload, meta, msg, 500, 'INVALID_ARGUMENTS');
}