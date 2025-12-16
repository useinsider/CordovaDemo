"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Utils = require("./Utils");
var InsiderConstants = require("./Constants");
var User = /*#__PURE__*/function () {
  function User() {
    _classCallCheck(this, User);
  }
  return _createClass(User, [{
    key: "setGender",
    value: function setGender(gender) {
      if (Utils.checkParameters([{
        type: 'number',
        value: gender
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setGender');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_GENDER, [gender]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setBirthday",
    value: function setBirthday(birthday) {
      if (Utils.checkParameters([{
        type: 'string',
        value: birthday
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setBirthday');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_BIRTDAY, [birthday.toISOString()]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setName",
    value: function setName(name) {
      if (Utils.checkParameters([{
        type: 'string',
        value: name
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setName');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_NAME, [name]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setSurname",
    value: function setSurname(surname) {
      if (Utils.checkParameters([{
        type: 'string',
        value: surname
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setSurname');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_SURNAME, [surname]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setAge",
    value: function setAge(age) {
      if (Utils.checkParameters([{
        type: 'string',
        value: age
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setAge');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_AGE, [age]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setEmail",
    value: function setEmail(email) {
      if (Utils.checkParameters([{
        type: 'string',
        value: email
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setEmail');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_EMAIL, [email]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setPhoneNumber",
    value: function setPhoneNumber(phone) {
      if (Utils.checkParameters([{
        type: 'string',
        value: phone
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setPhoneNumber');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_PHONE_NUMBER, [phone]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setLanguage",
    value: function setLanguage(language) {
      if (Utils.checkParameters([{
        type: 'string',
        value: language
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setLanguage');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LANGUAGE, [language]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setLocale",
    value: function setLocale(locale) {
      if (Utils.checkParameters([{
        type: 'string',
        value: locale
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setLocale');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LOCALE, [locale]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setFacebookID",
    value: function setFacebookID(facebookID) {
      if (Utils.checkParameters([{
        type: 'string',
        value: facebookID
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setFacebookID');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_FACEBOOK_ID, [facebookID]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setTwitterID",
    value: function setTwitterID(twitterID) {
      if (Utils.checkParameters([{
        type: 'string',
        value: twitterID
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setTwitterID');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_TWITTER_ID, [twitterID]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setEmailOptin",
    value: function setEmailOptin(emailOptIn) {
      if (Utils.checkParameters([{
        type: 'boolean',
        value: emailOptIn
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setEmailOptin');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_EMAIL_OPTIN, [emailOptIn]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setSMSOptin",
    value: function setSMSOptin(smsOptIn) {
      if (Utils.checkParameters([{
        type: 'boolean',
        value: smsOptIn
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setSMSOptin');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_SMS_OPTIN, [smsOptIn]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setPushOptin",
    value: function setPushOptin(pushOptIn) {
      if (Utils.checkParameters([{
        type: 'boolean',
        value: pushOptIn
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setPushOptin');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_PUSH_OPTIN, [pushOptIn]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setLocationOptin",
    value: function setLocationOptin(locationOptIn) {
      if (Utils.checkParameters([{
        type: 'boolean',
        value: locationOptIn
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setLocationOptin');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LOCATION_OPTIN, [locationOptIn]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setWhatsappOptin",
    value: function setWhatsappOptin(whatsappOptin) {
      if (Utils.checkParameters([{
        type: 'boolean',
        value: whatsappOptin
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setWhatsappOptin');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_WHATSAPP_OPTIN, [whatsappOptin]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "login",
    value: function login(identifiers, insiderIDResult) {
      try {
        if (!Utils.checkParameters([{
          type: 'function',
          value: insiderIDResult
        }, {
          type: 'object',
          value: identifiers
        }])) {
          Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGIN, [identifiers, insiderIDResult]).then(function (id) {
            return insiderIDResult(id);
          });
        } else if (!Utils.checkParameters([{
          type: 'object',
          value: identifiers
        }])) {
          Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGIN, [identifiers]);
        } else {
          Utils.showParameterWarningLog(this.constructor.name + '-login');
        }
      } catch (error) {
        Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "logout",
    value: function logout() {
      try {
        return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGOUT, []);
      } catch (error) {
        Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "logoutResettingInsiderID",
    value: function logoutResettingInsiderID(identifiers, insiderIDResult) {
      try {
        var identifiersArray = identifiers && Array.isArray(identifiers) ? identifiers.map(function (id) {
          return id.identifiers;
        }) : null;
        if (!Utils.checkParameters([{
          type: 'function',
          value: insiderIDResult
        }])) {
          Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGOUT_RESETTING_INSIDER_ID, [identifiersArray, insiderIDResult]).then(function (id) {
            return insiderIDResult(id);
          });
        } else {
          Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGOUT_RESETTING_INSIDER_ID, [identifiersArray]);
        }
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "setCustomAttributeWithString",
    value: function setCustomAttributeWithString(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'string',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithString');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_STRING, [key, value]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithInt",
    value: function setCustomAttributeWithInt(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'number',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithInt');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_INT, [key, value]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithDouble",
    value: function setCustomAttributeWithDouble(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'number',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithDouble');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_DOUBLE, [key, value]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithBoolean",
    value: function setCustomAttributeWithBoolean(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'boolean',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithBoolean');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_BOOLEAN, [key, value]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithDate",
    value: function setCustomAttributeWithDate(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'object',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithDate');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_DATE, [key, value.toISOString()]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithArray",
    value: function setCustomAttributeWithArray(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'object',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithArray');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_ARRAY, [key, value]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "unsetCustomAttribute",
    value: function unsetCustomAttribute(key) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-unsetCustomAttribute');
        return this;
      }
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.UNSET_CUSTOM_ATTRIBUTE, [key]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }]);
}();
module.exports = User;