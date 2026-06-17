cordova.define("cordova-plugin-insider.Utils", function(require, exports, module) {
"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
module.exports = {
  asyncExec: function asyncExec(className, reference) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return new Promise(function (resolve, reject) {
      window.cordova.exec(resolve, reject, className, reference, args);
    });
  },
  generateJSONErrorString: function generateJSONErrorString(error) {
    return '[InsiderCordova][JavaScriptError] ' + error;
  },
  checkParameters: function checkParameters(parameters) {
    return parameters.some(function (parameterConfig) {
      switch (parameterConfig.type) {
        case "numeric_array":
          if (!Array.isArray(parameterConfig.value)) {
            return true;
          }
          return !parameterConfig.value.every(function (item) {
            return typeof item === "number";
          });
        case "string_array":
          if (!Array.isArray(parameterConfig.value)) {
            return true;
          }
          return !parameterConfig.value.every(function (item) {
            return typeof item === "string";
          });
        default:
          return parameterConfig.type !== _typeof(parameterConfig.value);
      }
    });
  },
  showParameterWarningLog: function showParameterWarningLog(functionName) {
    console.warn("[InsiderCordova] paramaters is not valid, function: " + functionName);
  },
  isPlainObject: function isPlainObject(value) {
    if (value === null || _typeof(value) !== 'object') {
      return false;
    }
    return Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
  },
  parseObjectWithTypes: function parseObjectWithTypes(parameters) {
    var _this = this;
    if (!this.isPlainObject(parameters)) {
      return [];
    }
    return Object.entries(parameters).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      var type = _this.detectType(value);
      return {
        key: key,
        type: type,
        value: type === 'date' ? value.getTime() : value
      };
    }).filter(function (param) {
      return param.type !== 'unknown';
    });
  },
  detectType: function detectType(value) {
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (value instanceof Date) {
      return 'date';
    }
    if (Array.isArray(value)) {
      if (value.every(function (item) {
        return typeof item === 'number';
      })) {
        return 'numeric_array';
      }
      if (value.every(function (item) {
        return typeof item === 'string';
      })) {
        return 'string_array';
      }
      return 'unknown';
    }
    if (typeof value === 'number' && !isNaN(value)) {
      if (Number.isInteger(value)) {
        return 'integer';
      }
      return 'double';
    }
    if (typeof value === 'string') {
      return 'string';
    }
    return 'unknown';
  },
  resolveWithCallback: function resolveWithCallback(promise, completion) {
    if (typeof completion === 'function') {
      promise.then(function (result) {
        return completion(null, result);
      }).catch(function (error) {
        return completion(error, null);
      });
      return;
    }
    return promise;
  }
};
});
