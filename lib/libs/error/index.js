'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _ = require('lodash');

var BaseError = require('./base');

var errorFactory = function errorFactory(name, codes) {
  var CustomError =
  /*#__PURE__*/
  function (_BaseError) {
    _inherits(CustomError, _BaseError);

    function CustomError(code, message, data) {
      var _this;

      _classCallCheck(this, CustomError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomError).call(this, code, message, data));
      _this.name = name + 'Error';
      _this.code = code || CustomError.DEFAULT;
      var status = finalCodes[code];
      _this.status = status || 400;

      _this.init();

      return _this;
    }

    return CustomError;
  }(BaseError);

  var finalCodes = {};
  CustomError._prefix = errorFactory.prefix + name.toUpperCase() + '_';
  CustomError.DEFAULT = CustomError._prefix + 'GENERIC';

  _.forEach(codes, function (value, key) {
    var fullCode = CustomError._prefix + key;
    CustomError[key] = fullCode;
    finalCodes[fullCode] = value;
  });

  CustomError.create = function (code, message) {
    return new CustomError(code, message);
  };

  CustomError["throw"] = function (code, message) {
    throw new CustomError(code, message);
  };

  return CustomError;
};

module.exports = errorFactory;
errorFactory.BaseError = BaseError;
errorFactory.prefix = 'ERR_APP_';