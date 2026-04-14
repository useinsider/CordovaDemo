cordova.define("cordova-plugin-insider.InsiderMessageCenterMessage", function(require, exports, module) {
"use strict";

/**
 * Lazy getter for InsiderMessageCenter to avoid circular dependency.
 * The module is only required when actually needed (lazy loading).
 * 
 * Note: Using require() instead of import because:
 * - Cordova plugins use CommonJS (require/module.exports)
 * - require() supports dynamic/lazy loading for circular dependencies
 * - import is static and doesn't support lazy loading well
 * - All Cordova/Ionic versions support require()
 */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _insiderMessageCenter = null;
function getInsiderMessageCenter() {
  if (!_insiderMessageCenter) {
    _insiderMessageCenter = require('./InsiderMessageCenter');
  }
  return _insiderMessageCenter;
}

/**
 * Represents the textual content of a message center message.
 *
 * This model contains the title and description text that is displayed in the message.
 */
var _title = /*#__PURE__*/new WeakMap();
var _description = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterMessageContent = /*#__PURE__*/function () {
  function InsiderMessageCenterMessageContent(_ref) {
    var title = _ref.title,
      description = _ref.description;
    _classCallCheck(this, InsiderMessageCenterMessageContent);
    _classPrivateFieldInitSpec(this, _title, void 0);
    _classPrivateFieldInitSpec(this, _description, void 0);
    _classPrivateFieldSet(_title, this, title);
    _classPrivateFieldSet(_description, this, description);
  }
  return _createClass(InsiderMessageCenterMessageContent, [{
    key: "title",
    get: function get() {
      return _classPrivateFieldGet(_title, this);
    }
  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(_description, this);
    }
  }]);
}();
/**
 * Represents an image associated with a message center message.
 *
 * This model contains the image URL to be displayed in the message.
 */
var _url = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterMessageImage = /*#__PURE__*/function () {
  function InsiderMessageCenterMessageImage(_ref2) {
    var url = _ref2.url;
    _classCallCheck(this, InsiderMessageCenterMessageImage);
    _classPrivateFieldInitSpec(this, _url, void 0);
    _classPrivateFieldSet(_url, this, url);
  }
  return _createClass(InsiderMessageCenterMessageImage, [{
    key: "url",
    get: function get() {
      return _classPrivateFieldGet(_url, this);
    }
  }]);
}();
/**
 * Represents an action button within a message center message.
 *
 * This model defines a button that can be displayed in a message, containing text and an
 * associated action that is executed when the button is tapped.
 */
var _id = /*#__PURE__*/new WeakMap();
var _messageId = /*#__PURE__*/new WeakMap();
var _text = /*#__PURE__*/new WeakMap();
var _action = /*#__PURE__*/new WeakMap();
var _data = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterMessageButton = /*#__PURE__*/function () {
  function InsiderMessageCenterMessageButton(data) {
    _classCallCheck(this, InsiderMessageCenterMessageButton);
    _classPrivateFieldInitSpec(this, _id, void 0);
    _classPrivateFieldInitSpec(this, _messageId, void 0);
    _classPrivateFieldInitSpec(this, _text, void 0);
    _classPrivateFieldInitSpec(this, _action, void 0);
    _classPrivateFieldInitSpec(this, _data, void 0);
    _classPrivateFieldSet(_id, this, data.id);
    _classPrivateFieldSet(_messageId, this, data.messageId);
    _classPrivateFieldSet(_text, this, data.text);
    _classPrivateFieldSet(_action, this, data.action);
    _classPrivateFieldSet(_data, this, data);
  }
  return _createClass(InsiderMessageCenterMessageButton, [{
    key: "data",
    get: function get() {
      return JSON.parse(JSON.stringify(_classPrivateFieldGet(_data, this)));
    }
  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(_id, this);
    }
  }, {
    key: "messageId",
    get: function get() {
      return _classPrivateFieldGet(_messageId, this);
    }
  }, {
    key: "text",
    get: function get() {
      return _classPrivateFieldGet(_text, this);
    }
  }, {
    key: "action",
    get: function get() {
      return _classPrivateFieldGet(_action, this);
    }
  }, {
    key: "click",
    value: function click() {
      getInsiderMessageCenter().clickButton(this);
    }
  }]);
}();
/**
 * Defines the interface for message center message actions.
 *
 * Conforming types represent different actions that can be executed when a user interacts
 * with a message or button, such as opening a deeplink or navigating to app settings.
 */
var _type = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterAction = /*#__PURE__*/function () {
  function InsiderMessageCenterAction(_ref3) {
    var actionType = _ref3.actionType;
    _classCallCheck(this, InsiderMessageCenterAction);
    _classPrivateFieldInitSpec(this, _type, void 0);
    _classPrivateFieldSet(_type, this, actionType);
  }
  return _createClass(InsiderMessageCenterAction, [{
    key: "type",
    get: function get() {
      return _classPrivateFieldGet(_type, this);
    }
  }]);
}();
/**
 * Represents a deeplink action that navigates to a specific location in the app or external URL.
 *
 * This action model contains the data needed to construct and execute a deeplink navigation,
 * including key-value pairs that define the deeplink parameters.
 */
var _urlScheme = /*#__PURE__*/new WeakMap();
var _internalBrowserUrl = /*#__PURE__*/new WeakMap();
var _externalBrowserUrl = /*#__PURE__*/new WeakMap();
var _json = /*#__PURE__*/new WeakMap();
var _keyValues = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterDeeplinkAction = /*#__PURE__*/function (_InsiderMessageCenter) {
  function InsiderMessageCenterDeeplinkAction(_ref4) {
    var _this;
    var url_scheme = _ref4.url_scheme,
      internal_browser_url = _ref4.internal_browser_url,
      external_browser_url = _ref4.external_browser_url,
      json = _ref4.json,
      key_value = _ref4.key_value;
    _classCallCheck(this, InsiderMessageCenterDeeplinkAction);
    _this = _callSuper(this, InsiderMessageCenterDeeplinkAction, [{
      actionType: 'deep_link'
    }]);
    _classPrivateFieldInitSpec(_this, _urlScheme, void 0);
    _classPrivateFieldInitSpec(_this, _internalBrowserUrl, void 0);
    _classPrivateFieldInitSpec(_this, _externalBrowserUrl, void 0);
    _classPrivateFieldInitSpec(_this, _json, void 0);
    _classPrivateFieldInitSpec(_this, _keyValues, void 0);
    _classPrivateFieldSet(_urlScheme, _this, url_scheme);
    _classPrivateFieldSet(_internalBrowserUrl, _this, internal_browser_url);
    _classPrivateFieldSet(_externalBrowserUrl, _this, external_browser_url);
    _classPrivateFieldSet(_json, _this, json);
    _classPrivateFieldSet(_keyValues, _this, key_value);
    return _this;
  }
  _inherits(InsiderMessageCenterDeeplinkAction, _InsiderMessageCenter);
  return _createClass(InsiderMessageCenterDeeplinkAction, [{
    key: "url",
    get: function get() {
      var _ref5, _ref6, _classPrivateFieldGet2;
      return (_ref5 = (_ref6 = (_classPrivateFieldGet2 = _classPrivateFieldGet(_urlScheme, this)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : _classPrivateFieldGet(_internalBrowserUrl, this)) !== null && _ref6 !== void 0 ? _ref6 : _classPrivateFieldGet(_externalBrowserUrl, this)) !== null && _ref5 !== void 0 ? _ref5 : null;
    }
  }, {
    key: "json",
    get: function get() {
      return _classPrivateFieldGet(_json, this);
    }
  }, {
    key: "keyValues",
    get: function get() {
      return _classPrivateFieldGet(_keyValues, this);
    }
  }]);
}(InsiderMessageCenterAction);
/**
 * Represents an action that opens the app's settings.
 */
var InsiderMessageCenterOpenSettingsAction = /*#__PURE__*/function (_InsiderMessageCenter2) {
  function InsiderMessageCenterOpenSettingsAction() {
    _classCallCheck(this, InsiderMessageCenterOpenSettingsAction);
    return _callSuper(this, InsiderMessageCenterOpenSettingsAction, [{
      actionType: 'open_settings'
    }]);
  }
  _inherits(InsiderMessageCenterOpenSettingsAction, _InsiderMessageCenter2);
  return _createClass(InsiderMessageCenterOpenSettingsAction);
}(InsiderMessageCenterAction);
/**
 * Represents a feedback action.
 */
var InsiderMessageCenterFeedbackAction = /*#__PURE__*/function (_InsiderMessageCenter3) {
  function InsiderMessageCenterFeedbackAction() {
    _classCallCheck(this, InsiderMessageCenterFeedbackAction);
    return _callSuper(this, InsiderMessageCenterFeedbackAction, [{
      actionType: 'feedback'
    }]);
  }
  _inherits(InsiderMessageCenterFeedbackAction, _InsiderMessageCenter3);
  return _createClass(InsiderMessageCenterFeedbackAction);
}(InsiderMessageCenterAction);
/**
 * Represents a single message in the message center.
 *
 * This model contains all the data for a message center message, including its content,
 * images, buttons, and associated actions. Messages can be either text-based or image-based.
 */
var _id2 = /*#__PURE__*/new WeakMap();
var _type2 = /*#__PURE__*/new WeakMap();
var _read = /*#__PURE__*/new WeakMap();
var _images = /*#__PURE__*/new WeakMap();
var _content = /*#__PURE__*/new WeakMap();
var _buttons = /*#__PURE__*/new WeakMap();
var _action2 = /*#__PURE__*/new WeakMap();
var _data2 = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterMessage = /*#__PURE__*/function () {
  function InsiderMessageCenterMessage(data) {
    var _data$images, _data$buttons;
    _classCallCheck(this, InsiderMessageCenterMessage);
    _classPrivateFieldInitSpec(this, _id2, void 0);
    _classPrivateFieldInitSpec(this, _type2, void 0);
    _classPrivateFieldInitSpec(this, _read, void 0);
    _classPrivateFieldInitSpec(this, _images, void 0);
    _classPrivateFieldInitSpec(this, _content, void 0);
    _classPrivateFieldInitSpec(this, _buttons, void 0);
    _classPrivateFieldInitSpec(this, _action2, void 0);
    _classPrivateFieldInitSpec(this, _data2, void 0);
    _classPrivateFieldSet(_id2, this, data.id);
    _classPrivateFieldSet(_type2, this, data.type);
    _classPrivateFieldSet(_read, this, data.read);
    _classPrivateFieldSet(_images, this, (_data$images = data.images) === null || _data$images === void 0 ? void 0 : _data$images.map(function (img) {
      return new InsiderMessageCenterMessageImage(img);
    }));
    _classPrivateFieldSet(_content, this, data.content ? new InsiderMessageCenterMessageContent(data.content) : null);
    _classPrivateFieldSet(_buttons, this, (_data$buttons = data.buttons) === null || _data$buttons === void 0 ? void 0 : _data$buttons.map(function (btn) {
      return new InsiderMessageCenterMessageButton(_objectSpread(_objectSpread({}, btn), {}, {
        messageId: data.id
      }));
    }));
    _classPrivateFieldSet(_data2, this, data);
    if (_classPrivateFieldGet(_data2, this).action) {
      switch (_classPrivateFieldGet(_data2, this).action.type) {
        case 'deep_link':
          _classPrivateFieldSet(_action2, this, new InsiderMessageCenterDeeplinkAction(_classPrivateFieldGet(_data2, this).action));
          break;
        case 'open_settings':
          _classPrivateFieldSet(_action2, this, new InsiderMessageCenterOpenSettingsAction());
          break;
        case 'feedback':
          _classPrivateFieldSet(_action2, this, new InsiderMessageCenterFeedbackAction());
          break;
        default:
          _classPrivateFieldSet(_action2, this, null);
          break;
      }
    } else {
      _classPrivateFieldSet(_action2, this, null);
    }
  }
  return _createClass(InsiderMessageCenterMessage, [{
    key: "data",
    get: function get() {
      return JSON.parse(JSON.stringify(_classPrivateFieldGet(_data2, this)));
    }
  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(_id2, this);
    }
  }, {
    key: "type",
    get: function get() {
      return _classPrivateFieldGet(_type2, this);
    }
  }, {
    key: "isRead",
    get: function get() {
      return _classPrivateFieldGet(_read, this);
    }
  }, {
    key: "images",
    get: function get() {
      return _classPrivateFieldGet(_images, this);
    }
  }, {
    key: "content",
    get: function get() {
      return _classPrivateFieldGet(_content, this);
    }
  }, {
    key: "buttons",
    get: function get() {
      return _classPrivateFieldGet(_buttons, this);
    }
  }, {
    key: "action",
    get: function get() {
      return _classPrivateFieldGet(_action2, this);
    }
  }, {
    key: "markAsRead",
    value: function markAsRead(completion) {
      getInsiderMessageCenter().markAsRead([this.id], completion);
    }
  }, {
    key: "markAsUnread",
    value: function markAsUnread(completion) {
      getInsiderMessageCenter().markAsUnread([this.id], completion);
    }
  }, {
    key: "delete",
    value: function _delete(completion) {
      getInsiderMessageCenter().deleteMessages([this.id], completion);
    }
  }, {
    key: "view",
    value: function view() {
      getInsiderMessageCenter().viewMessage(this);
    }
  }, {
    key: "click",
    value: function click() {
      getInsiderMessageCenter().clickMessage(this);
    }
  }]);
}();
/**
 * Represents the inbox model containing all message center messages.
 *
 * This model is the root container for message center data, holding an array of message models
 * that can be displayed in the message center UI.
 */
var _messages = /*#__PURE__*/new WeakMap();
var InsiderMessageCenterInbox = /*#__PURE__*/function () {
  function InsiderMessageCenterInbox(_ref7) {
    var _items$map;
    var items = _ref7.items;
    _classCallCheck(this, InsiderMessageCenterInbox);
    _classPrivateFieldInitSpec(this, _messages, void 0);
    _classPrivateFieldSet(_messages, this, (_items$map = items === null || items === void 0 ? void 0 : items.map(function (item) {
      return new InsiderMessageCenterMessage(item);
    })) !== null && _items$map !== void 0 ? _items$map : []);
  }
  return _createClass(InsiderMessageCenterInbox, [{
    key: "messages",
    get: function get() {
      return _classPrivateFieldGet(_messages, this);
    }
  }]);
}();
module.exports = {
  InsiderMessageCenterMessageContent: InsiderMessageCenterMessageContent,
  InsiderMessageCenterMessageImage: InsiderMessageCenterMessageImage,
  InsiderMessageCenterMessageButton: InsiderMessageCenterMessageButton,
  InsiderMessageCenterAction: InsiderMessageCenterAction,
  InsiderMessageCenterDeeplinkAction: InsiderMessageCenterDeeplinkAction,
  InsiderMessageCenterOpenSettingsAction: InsiderMessageCenterOpenSettingsAction,
  InsiderMessageCenterFeedbackAction: InsiderMessageCenterFeedbackAction,
  InsiderMessageCenterMessage: InsiderMessageCenterMessage,
  InsiderMessageCenterInbox: InsiderMessageCenterInbox
};
});
