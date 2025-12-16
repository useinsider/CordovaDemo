cordova.define("cordova-plugin-insider.Identifier", function(require, exports, module) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Utils = require("./Utils");
var InsiderConstants = require("./Constants");
var Identifier = /*#__PURE__*/function () {
  function Identifier() {
    _classCallCheck(this, Identifier);
    _defineProperty(this, "identifiers", {});
    this.identifiers = {};
  }
  return _createClass(Identifier, [{
    key: "addEmail",
    value: function addEmail(email) {
      if (Utils.checkParameters([{
        type: 'string',
        value: email
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addEmail');
        return this;
      }
      try {
        this.identifiers[InsiderConstants.ADD_EMAIL] = email;
      } catch (error) {
        Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "addPhoneNumber",
    value: function addPhoneNumber(phoneNumber) {
      if (Utils.checkParameters([{
        type: 'string',
        value: phoneNumber
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addPhoneNumber');
        return this;
      }
      try {
        this.identifiers[InsiderConstants.ADD_PHONE_NUMBER] = phoneNumber;
      } catch (error) {
        Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "addUserID",
    value: function addUserID(userID) {
      if (Utils.checkParameters([{
        type: 'string',
        value: userID
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addUserID');
        return this;
      }
      try {
        this.identifiers[InsiderConstants.ADD_USER_ID] = userID;
      } catch (error) {
        Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "addCustomIdentifier",
    value: function addCustomIdentifier(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'string',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addCustomIdentifier');
        return this;
      }
      try {
        this.identifiers[key] = value;
      } catch (error) {
        Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "getIdentifiers",
    value: function getIdentifiers() {
      return this.identifiers;
    }
  }]);
}();
module.exports = Identifier;
});
