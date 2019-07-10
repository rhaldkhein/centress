"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Bar =
/*#__PURE__*/
function () {
  function Bar() {
    _classCallCheck(this, Bar);
  }

  _createClass(Bar, [{
    key: "api",
    value: function api(apiRouter) {
      apiRouter.get('/test', function (req, res, next) {
        req.service('foo'); // singleton

        req.service('yoo'); // transient
        // res.jsonError().badRequest()

        next();
      });
      apiRouter.get('/test', function (req, res) {
        req.service('foo'); // singleton

        req.service('yoo'); // transient

        res.jsonError().badRequest();
      });
    }
  }, {
    key: "page",
    value: function page(pageRouter) {
      pageRouter.get('/page', function (req, res) {
        res.send('page');
      });
    }
  }]);

  return Bar;
}();

exports["default"] = Bar;

_defineProperty(Bar, "service", 'bar');