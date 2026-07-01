"use strict";

/**
 * Error codes for App Cards operations.
 *
 * These codes are aligned with the native SDK error codes on both Android and iOS:
 * - Android: AppCardsException.AppCardsExceptionCode
 * - iOS: InsiderAppCardsErrorCode
 *
 * @readonly
 * @enum {string}
 */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var InsiderAppCardsErrorCode = Object.freeze({
  UNKNOWN: 'unknown',
  SDK_NOT_INITIALIZED: 'sdkNotInitialized',
  INVALID_PARAMETER: 'invalidParameter',
  NETWORK_ERROR: 'networkError',
  SERVER_ERROR: 'serverError',
  PARSE_ERROR: 'parseError'
});

/**
 * Represents a typed error from an App Cards operation.
 *
 * Extends the standard Error class with a structured error code
 * that maps to the native SDK error codes on both Android and iOS.
 */
var _code = /*#__PURE__*/new WeakMap();
var InsiderAppCardsError = /*#__PURE__*/function (_Error) {
  /**
   * @param {string} code - One of InsiderAppCardsErrorCode values.
   * @param {string} message - A human-readable error description.
   */
  function InsiderAppCardsError(code, message) {
    var _this;
    _classCallCheck(this, InsiderAppCardsError);
    _this = _callSuper(this, InsiderAppCardsError, [message]);
    _classPrivateFieldInitSpec(_this, _code, void 0);
    _this.name = 'InsiderAppCardsError';
    _classPrivateFieldSet(_code, _this, code);
    return _this;
  }

  /**
   * The error code identifying the type of error.
   * @returns {string} One of InsiderAppCardsErrorCode values.
   */
  _inherits(InsiderAppCardsError, _Error);
  return _createClass(InsiderAppCardsError, [{
    key: "code",
    get: function get() {
      return _classPrivateFieldGet(_code, this);
    }

    /**
     * Creates an InsiderAppCardsError from a native bridge error response.
     *
     * The native bridge sends either:
     * - A structured object: { code: string, message: string }
     * - A plain string (legacy/fallback)
     *
     * @param {Object|string} error - The error from the native bridge.
     * @returns {InsiderAppCardsError}
     */
  }], [{
    key: "from",
    value: function from(error) {
      if (error && _typeof(error) === 'object' && error.code && error.message) {
        return new InsiderAppCardsError(error.code, error.message);
      }
      return new InsiderAppCardsError(InsiderAppCardsErrorCode.UNKNOWN, typeof error === 'string' ? error : 'An unexpected error occurred.');
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(Error));
module.exports = {
  InsiderAppCardsError: InsiderAppCardsError,
  InsiderAppCardsErrorCode: InsiderAppCardsErrorCode
};