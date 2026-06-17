cordova.define("cordova-plugin-insider.InsiderAppCard", function(require, exports, module) {
"use strict";

/**
 * Lazy getter for InsiderAppCards to avoid circular dependency.
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
var _insiderAppCards = null;
function getInsiderAppCards() {
  if (!_insiderAppCards) {
    _insiderAppCards = require('./InsiderAppCards');
  }
  return _insiderAppCards;
}

/**
 * Represents the textual content of an app card.
 *
 * This model contains the title and description text that is displayed in the app card.
 */
var _title = /*#__PURE__*/new WeakMap();
var _description = /*#__PURE__*/new WeakMap();
var InsiderAppCardContent = /*#__PURE__*/function () {
  function InsiderAppCardContent(_ref) {
    var title = _ref.title,
      description = _ref.description;
    _classCallCheck(this, InsiderAppCardContent);
    _classPrivateFieldInitSpec(this, _title, void 0);
    _classPrivateFieldInitSpec(this, _description, void 0);
    _classPrivateFieldSet(_title, this, title);
    _classPrivateFieldSet(_description, this, description);
  }
  return _createClass(InsiderAppCardContent, [{
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
 * Represents an image associated with an app card.
 *
 * This model contains the image URL to be displayed in the app card.
 */
var _url = /*#__PURE__*/new WeakMap();
var InsiderAppCardImage = /*#__PURE__*/function () {
  function InsiderAppCardImage(_ref2) {
    var url = _ref2.url;
    _classCallCheck(this, InsiderAppCardImage);
    _classPrivateFieldInitSpec(this, _url, void 0);
    _classPrivateFieldSet(_url, this, url);
  }
  return _createClass(InsiderAppCardImage, [{
    key: "url",
    get: function get() {
      return _classPrivateFieldGet(_url, this);
    }
  }]);
}();
/**
 * Represents an action button within an app card.
 *
 * This model defines a button that can be displayed in an app card, containing text and an
 * associated action that is executed when the button is tapped.
 */
var _id = /*#__PURE__*/new WeakMap();
var _appCardId = /*#__PURE__*/new WeakMap();
var _text = /*#__PURE__*/new WeakMap();
var _action = /*#__PURE__*/new WeakMap();
var _data = /*#__PURE__*/new WeakMap();
var InsiderAppCardButton = /*#__PURE__*/function () {
  function InsiderAppCardButton(data) {
    _classCallCheck(this, InsiderAppCardButton);
    _classPrivateFieldInitSpec(this, _id, void 0);
    _classPrivateFieldInitSpec(this, _appCardId, void 0);
    _classPrivateFieldInitSpec(this, _text, void 0);
    _classPrivateFieldInitSpec(this, _action, void 0);
    _classPrivateFieldInitSpec(this, _data, void 0);
    _classPrivateFieldSet(_id, this, data.id);
    _classPrivateFieldSet(_appCardId, this, data.appCardId);
    _classPrivateFieldSet(_text, this, data.text);
    _classPrivateFieldSet(_data, this, data);
    if (data.action) {
      switch (data.action.type) {
        case 'deep_link':
          _classPrivateFieldSet(_action, this, new InsiderAppCardDeeplinkAction(data.action));
          break;
        case 'open_settings':
          _classPrivateFieldSet(_action, this, new InsiderAppCardOpenSettingsAction());
          break;
        case 'feedback':
          _classPrivateFieldSet(_action, this, new InsiderAppCardFeedbackAction());
          break;
        default:
          _classPrivateFieldSet(_action, this, null);
          break;
      }
    } else {
      _classPrivateFieldSet(_action, this, null);
    }
  }
  return _createClass(InsiderAppCardButton, [{
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
    key: "appCardId",
    get: function get() {
      return _classPrivateFieldGet(_appCardId, this);
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
      getInsiderAppCards().clickButton(this);
    }
  }]);
}();
/**
 * Defines the interface for app card actions.
 *
 * Conforming types represent different actions that can be executed when a user interacts
 * with an app card or button, such as opening a deeplink or navigating to app settings.
 */
var _type = /*#__PURE__*/new WeakMap();
var InsiderAppCardAction = /*#__PURE__*/function () {
  function InsiderAppCardAction(_ref3) {
    var actionType = _ref3.actionType;
    _classCallCheck(this, InsiderAppCardAction);
    _classPrivateFieldInitSpec(this, _type, void 0);
    _classPrivateFieldSet(_type, this, actionType);
  }
  return _createClass(InsiderAppCardAction, [{
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
var _keysAndValues = /*#__PURE__*/new WeakMap();
var InsiderAppCardDeeplinkAction = /*#__PURE__*/function (_InsiderAppCardAction2) {
  function InsiderAppCardDeeplinkAction(_ref4) {
    var _this;
    var url_scheme = _ref4.url_scheme,
      internal_browser_url = _ref4.internal_browser_url,
      external_browser_url = _ref4.external_browser_url,
      json = _ref4.json,
      key_value = _ref4.key_value;
    _classCallCheck(this, InsiderAppCardDeeplinkAction);
    _this = _callSuper(this, InsiderAppCardDeeplinkAction, [{
      actionType: 'deep_link'
    }]);
    _classPrivateFieldInitSpec(_this, _urlScheme, void 0);
    _classPrivateFieldInitSpec(_this, _internalBrowserUrl, void 0);
    _classPrivateFieldInitSpec(_this, _externalBrowserUrl, void 0);
    _classPrivateFieldInitSpec(_this, _json, void 0);
    _classPrivateFieldInitSpec(_this, _keysAndValues, void 0);
    _classPrivateFieldSet(_urlScheme, _this, url_scheme);
    _classPrivateFieldSet(_internalBrowserUrl, _this, internal_browser_url);
    _classPrivateFieldSet(_externalBrowserUrl, _this, external_browser_url);
    _classPrivateFieldSet(_json, _this, json);
    _classPrivateFieldSet(_keysAndValues, _this, key_value);
    return _this;
  }
  _inherits(InsiderAppCardDeeplinkAction, _InsiderAppCardAction2);
  return _createClass(InsiderAppCardDeeplinkAction, [{
    key: "url",
    get: function get() {
      var _ref5, _ref6, _classPrivateFieldGet2;
      return (_ref5 = (_ref6 = (_classPrivateFieldGet2 = _classPrivateFieldGet(_urlScheme, this)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : _classPrivateFieldGet(_internalBrowserUrl, this)) !== null && _ref6 !== void 0 ? _ref6 : _classPrivateFieldGet(_externalBrowserUrl, this)) !== null && _ref5 !== void 0 ? _ref5 : null;
    }
  }, {
    key: "deeplinkType",
    get: function get() {
      if (_classPrivateFieldGet(_urlScheme, this) && _classPrivateFieldGet(_urlScheme, this).length > 0) return 'url_scheme';
      if (_classPrivateFieldGet(_internalBrowserUrl, this) && _classPrivateFieldGet(_internalBrowserUrl, this).length > 0) return 'internal';
      if (_classPrivateFieldGet(_externalBrowserUrl, this) && _classPrivateFieldGet(_externalBrowserUrl, this).length > 0) return 'external';
      return 'unknown';
    }
  }, {
    key: "json",
    get: function get() {
      return _classPrivateFieldGet(_json, this) ? JSON.parse(_classPrivateFieldGet(_json, this)) : null;
    }
  }, {
    key: "keysAndValues",
    get: function get() {
      return _classPrivateFieldGet(_keysAndValues, this);
    }
  }]);
}(InsiderAppCardAction);
/**
 * Represents an action that opens the app's settings.
 */
var InsiderAppCardOpenSettingsAction = /*#__PURE__*/function (_InsiderAppCardAction3) {
  function InsiderAppCardOpenSettingsAction() {
    _classCallCheck(this, InsiderAppCardOpenSettingsAction);
    return _callSuper(this, InsiderAppCardOpenSettingsAction, [{
      actionType: 'open_settings'
    }]);
  }
  _inherits(InsiderAppCardOpenSettingsAction, _InsiderAppCardAction3);
  return _createClass(InsiderAppCardOpenSettingsAction);
}(InsiderAppCardAction);
/**
 * Represents a feedback action.
 */
var InsiderAppCardFeedbackAction = /*#__PURE__*/function (_InsiderAppCardAction4) {
  function InsiderAppCardFeedbackAction() {
    _classCallCheck(this, InsiderAppCardFeedbackAction);
    return _callSuper(this, InsiderAppCardFeedbackAction, [{
      actionType: 'feedback'
    }]);
  }
  _inherits(InsiderAppCardFeedbackAction, _InsiderAppCardAction4);
  return _createClass(InsiderAppCardFeedbackAction);
}(InsiderAppCardAction);
/**
 * Represents a single app card.
 *
 * This model contains all the data for an app card, including its content,
 * images, buttons, and associated actions. App cards can be either text-based or image-based.
 */
var _id2 = /*#__PURE__*/new WeakMap();
var _type2 = /*#__PURE__*/new WeakMap();
var _read = /*#__PURE__*/new WeakMap();
var _images = /*#__PURE__*/new WeakMap();
var _content = /*#__PURE__*/new WeakMap();
var _buttons = /*#__PURE__*/new WeakMap();
var _action2 = /*#__PURE__*/new WeakMap();
var _data2 = /*#__PURE__*/new WeakMap();
var InsiderAppCard = /*#__PURE__*/function () {
  function InsiderAppCard(data) {
    var _data$images, _data$buttons;
    _classCallCheck(this, InsiderAppCard);
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
      return new InsiderAppCardImage(img);
    }));
    _classPrivateFieldSet(_content, this, data.content ? new InsiderAppCardContent(data.content) : null);
    _classPrivateFieldSet(_buttons, this, (_data$buttons = data.buttons) === null || _data$buttons === void 0 ? void 0 : _data$buttons.map(function (btn) {
      return new InsiderAppCardButton(_objectSpread(_objectSpread({}, btn), {}, {
        appCardId: data.id
      }));
    }));
    _classPrivateFieldSet(_data2, this, data);
    if (data.action) {
      switch (data.action.type) {
        case 'deep_link':
          _classPrivateFieldSet(_action2, this, new InsiderAppCardDeeplinkAction(data.action));
          break;
        case 'open_settings':
          _classPrivateFieldSet(_action2, this, new InsiderAppCardOpenSettingsAction());
          break;
        case 'feedback':
          _classPrivateFieldSet(_action2, this, new InsiderAppCardFeedbackAction());
          break;
        default:
          _classPrivateFieldSet(_action2, this, null);
          break;
      }
    } else {
      _classPrivateFieldSet(_action2, this, null);
    }
  }
  return _createClass(InsiderAppCard, [{
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
      var _this2 = this;
      if (typeof completion === 'function') {
        return getInsiderAppCards().markAsRead([this.id], function (error) {
          if (!error) {
            _classPrivateFieldSet(_read, _this2, true);
          }
          completion(error);
        });
      }
      return getInsiderAppCards().markAsRead([this.id]).then(function () {
        _classPrivateFieldSet(_read, _this2, true);
      });
    }
  }, {
    key: "markAsUnread",
    value: function markAsUnread(completion) {
      var _this3 = this;
      if (typeof completion === 'function') {
        return getInsiderAppCards().markAsUnread([this.id], function (error) {
          if (!error) {
            _classPrivateFieldSet(_read, _this3, false);
          }
          completion(error);
        });
      }
      return getInsiderAppCards().markAsUnread([this.id]).then(function () {
        _classPrivateFieldSet(_read, _this3, false);
      });
    }
  }, {
    key: "view",
    value: function view() {
      getInsiderAppCards().view(this);
    }
  }, {
    key: "click",
    value: function click() {
      getInsiderAppCards().click(this);
    }
  }, {
    key: "delete",
    value: function _delete(completion) {
      getInsiderAppCards().delete([this.id], completion);
    }
  }]);
}();
/**
 * Represents the campaign response containing all app cards.
 *
 * This model is the root container for app cards data, holding an array of app card models
 * that can be displayed in the app cards UI.
 */
var _appCards = /*#__PURE__*/new WeakMap();
var InsiderAppCardsCampaignResponse = /*#__PURE__*/function () {
  function InsiderAppCardsCampaignResponse(_ref7) {
    var _items$map;
    var items = _ref7.items;
    _classCallCheck(this, InsiderAppCardsCampaignResponse);
    _classPrivateFieldInitSpec(this, _appCards, void 0);
    _classPrivateFieldSet(_appCards, this, (_items$map = items === null || items === void 0 ? void 0 : items.map(function (item) {
      return new InsiderAppCard(item);
    })) !== null && _items$map !== void 0 ? _items$map : []);
  }
  return _createClass(InsiderAppCardsCampaignResponse, [{
    key: "appCards",
    get: function get() {
      return _classPrivateFieldGet(_appCards, this);
    }
  }]);
}();
module.exports = {
  InsiderAppCardContent: InsiderAppCardContent,
  InsiderAppCardImage: InsiderAppCardImage,
  InsiderAppCardButton: InsiderAppCardButton,
  InsiderAppCardAction: InsiderAppCardAction,
  InsiderAppCardDeeplinkAction: InsiderAppCardDeeplinkAction,
  InsiderAppCardOpenSettingsAction: InsiderAppCardOpenSettingsAction,
  InsiderAppCardFeedbackAction: InsiderAppCardFeedbackAction,
  InsiderAppCard: InsiderAppCard,
  InsiderAppCardsCampaignResponse: InsiderAppCardsCampaignResponse
};
});
