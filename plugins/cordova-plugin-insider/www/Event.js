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
var Event = /*#__PURE__*/function () {
  function Event(name) {
    _classCallCheck(this, Event);
    _defineProperty(this, "name", '');
    _defineProperty(this, "parameters", {});
    this.name = name;
  }
  return _createClass(Event, [{
    key: "addParameterWithString",
    value: function addParameterWithString(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'string',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithString');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithInt",
    value: function addParameterWithInt(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'number',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithInt');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithDouble",
    value: function addParameterWithDouble(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'number',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithDouble');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithBoolean",
    value: function addParameterWithBoolean(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'boolean',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithBoolean');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithDate",
    value: function addParameterWithDate(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'object',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithDate');
        return this;
      }
      try {
        this.parameters[key] = value.toISOString();
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithArray",
    value: function addParameterWithArray(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'object',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithArray');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithStringArray",
    value: function addParameterWithStringArray(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'string_array',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithStringArray');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "addParameterWithNumericArray",
    value: function addParameterWithNumericArray(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'numeric_array',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithNumericArray');
        return this;
      }
      try {
        this.parameters[key] = value;
        return this;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }, {
    key: "build",
    value: function build() {
      try {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.TAG_EVENT, [this.name, this.parameters]);
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
    }
  }]);
}();
module.exports = Event;