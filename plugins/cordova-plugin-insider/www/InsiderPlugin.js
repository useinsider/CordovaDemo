"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var InsiderProduct = require("./Product");
var InsiderEvent = require("./Event");
var InsiderUser = require("./User");
var InsiderIdentifier = require('./Identifier');
var InsiderCallbackType = require('./CallbackType');
var InsiderGender = require('./Gender');
var InsiderContentOptimizerDataType = require('./ContentOptimizerDataType');
var Utils = require("./Utils");
var InsiderConstants = require("./Constants");
var InsiderPlugin = /*#__PURE__*/_createClass(function InsiderPlugin() {
  var _this = this;
  _classCallCheck(this, InsiderPlugin);
  _defineProperty(this, "insiderUser", {});
  _defineProperty(this, "gender", InsiderGender);
  _defineProperty(this, "callbackType", InsiderCallbackType);
  _defineProperty(this, "contentOptimizerDataType", InsiderContentOptimizerDataType);
  _defineProperty(this, "initCordovaBase", function (partnerName, appGroup, customEndpoint, handleNotificationCallback) {
    try {
      var sdkVersion = InsiderConstants.SDK_VERSION;
      document.addEventListener('ins_notification_handle', handleNotificationCallback, false);
      if (customEndpoint !== null) Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.INIT_WITH_CUSTOM_ENDPOINT, [partnerName, sdkVersion, appGroup, customEndpoint]);else if (cordova.platformId === "ios") Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.INIT_WITH_LAUNCH_OPTIONS, [partnerName, sdkVersion, appGroup]);else Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.INIT, [partnerName, sdkVersion]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "init", function (partnerName, appGroup, handleNotificationCallback) {
    if (Utils.checkParameters([{
      type: 'string',
      value: partnerName
    }, {
      type: 'string',
      value: appGroup
    }, {
      type: 'function',
      value: handleNotificationCallback
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-init');
      return;
    }
    try {
      _this.initCordovaBase(partnerName, appGroup, null, handleNotificationCallback);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "initWithCustomEndpoint", function (partnerName, appGroup, endpoint, handleNotificationCallback) {
    if (Utils.checkParameters([{
      type: 'string',
      value: partnerName
    }, {
      type: 'string',
      value: appGroup
    }, {
      type: 'string',
      value: endpoint
    }, {
      type: 'function',
      value: handleNotificationCallback
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-init');
      return;
    }
    try {
      _this.initCordovaBase(partnerName, appGroup, endpoint, handleNotificationCallback);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "reinitWithPartnerName", function (partnerName) {
    if (Utils.checkParameters([{
      type: 'string',
      value: partnerName
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-reinit');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.REINIT_WITH_PARTNER_NAME, [partnerName]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getCurrentUser", function () {
    try {
      return _this.insiderUser;
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "tagEvent", function (eventName) {
    if (Utils.checkParameters([{
      type: 'string',
      value: eventName
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-tagEvent');
      return;
    }
    try {
      return new InsiderEvent(eventName);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "createNewProduct", function (productID, name, taxonomy, imageURL, price, currency) {
    if (Utils.checkParameters([{
      type: 'string',
      value: productID
    }, {
      type: 'string',
      value: name
    }, {
      type: 'object',
      value: taxonomy
    }, {
      type: 'string',
      value: imageURL
    }, {
      type: 'number',
      value: price
    }, {
      type: 'string',
      value: currency
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-createNewProduct');
      return new InsiderProduct('', '', [], '', 0, '');
    }
    return new InsiderProduct(productID, name, taxonomy, imageURL, price, currency);
  });
  _defineProperty(this, "itemPurchased", function (uniqueSaleID, product) {
    if (Utils.checkParameters([{
      type: 'string',
      value: uniqueSaleID
    }, {
      type: 'object',
      value: product
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-itemPurchased');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_PURCHASED, [uniqueSaleID, product.productMustMap, product.productOptMap]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "itemAddedToCart", function (product) {
    if (Utils.checkParameters([{
      type: 'object',
      value: product
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-itemAddedToCart');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_ADDED_TO_CART, [product.productMustMap, product.productOptMap]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "itemRemovedFromCart", function (productID) {
    if (Utils.checkParameters([{
      type: 'string',
      value: productID
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-itemRemovedFromCart');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_REMOVED_FROM_CART, [productID]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "cartCleared", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.CART_CLEARED, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getMessageCenterData", function (limit, startDate, endDate) {
    if (Utils.checkParameters([{
      type: 'number',
      value: limit
    }, {
      type: 'object',
      value: startDate
    }, {
      type: 'object',
      value: endDate
    }]) || startDate.getTime() === endDate.getTime() || startDate.getTime() > endDate.getTime()) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getMessageCenterData');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_MESSAGE_CENTER_DATA, [limit, startDate.getTime(), endDate.getTime()]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getSmartRecommendation", function (recommendationID, locale, currency) {
    if (Utils.checkParameters([{
      type: 'number',
      value: recommendationID
    }, {
      type: 'string',
      value: locale
    }, {
      type: 'string',
      value: currency
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getSmartRecommendation');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_SMART_RECOMMENDATION, [recommendationID, locale, currency]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getSmartRecommendationWithProduct", function (product, recommendationID, locale) {
    if (Utils.checkParameters([{
      type: 'number',
      value: recommendationID
    }, {
      type: 'string',
      value: locale
    }, {
      type: 'object',
      value: product
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getSmartRecommendationWithProduct');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_SMART_RECOMMENDATION_WITH_PRODUCT, [product.productMustMap, product.productOptMap, recommendationID, locale]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getSmartRecommendationWithProductIDs", function (productIDs, recommendationID, locale, currency) {
    if (Utils.checkParameters([{
      type: 'number',
      value: recommendationID
    }, {
      type: 'string',
      value: locale
    }, {
      type: 'string',
      value: currency
    }, {
      type: 'object',
      value: productIDs
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getSmartRecommendationWithProductIDs');
      return;
    }
    productIDs = productIDs.filter(function (value) {
      return value != null && typeof value == "string" && value.trim();
    });
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_SMART_RECOMMENDATION_WITH_PRODUCT_IDS, [productIDs, recommendationID, locale, currency]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "clickSmartRecommendationProduct", function (product, recommendationID) {
    if (Utils.checkParameters([{
      type: 'number',
      value: recommendationID
    }, {
      type: 'object',
      value: product
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-clickSmartRecommendationProduct');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.CLICK_SMART_RECOMMENDATION_PRODUCT, [product.productMustMap, product.productOptMap, recommendationID]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getContentStringWithName", function (variableName, defaultValue, contentOptimizerDataType) {
    if (Utils.checkParameters([{
      type: 'string',
      value: variableName
    }, {
      type: 'string',
      value: defaultValue
    }, {
      type: 'number',
      value: contentOptimizerDataType
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getContentStringWithName');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_STRING_WITH_NAME, [variableName, defaultValue, contentOptimizerDataType]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getContentBoolWithName", function (variableName, defaultValue, contentOptimizerDataType) {
    if (Utils.checkParameters([{
      type: 'string',
      value: variableName
    }, {
      type: 'boolean',
      value: defaultValue
    }, {
      type: 'number',
      value: contentOptimizerDataType
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getContentBoolWithName');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_BOOL_WITH_NAME, [variableName, defaultValue, contentOptimizerDataType]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getContentIntWithName", function (variableName, defaultValue, contentOptimizerDataType) {
    if (Utils.checkParameters([{
      type: 'string',
      value: variableName
    }, {
      type: 'number',
      value: defaultValue
    }, {
      type: 'number',
      value: contentOptimizerDataType
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getContentIntWithName');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_INT_WITH_NAME, [variableName, defaultValue, contentOptimizerDataType]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getContentStringWithoutCache", function (variableName, defaultValue, contentOptimizerDataType) {
    if (Utils.checkParameters([{
      type: 'string',
      value: variableName
    }, {
      type: 'string',
      value: defaultValue
    }, {
      type: 'number',
      value: contentOptimizerDataType
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getContentStringWithoutCache');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_STRING_WITHOUT_CACHE, [variableName, defaultValue, contentOptimizerDataType]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getContentBoolWithoutCache", function (variableName, defaultValue, contentOptimizerDataType) {
    if (Utils.checkParameters([{
      type: 'string',
      value: variableName
    }, {
      type: 'boolean',
      value: defaultValue
    }, {
      type: 'number',
      value: contentOptimizerDataType
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getContentBoolWithoutCache');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_BOOL_WITHOUT_CACHE, [variableName, defaultValue, contentOptimizerDataType]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getContentIntWithoutCache", function (variableName, defaultValue, contentOptimizerDataType) {
    if (Utils.checkParameters([{
      type: 'string',
      value: variableName
    }, {
      type: 'number',
      value: defaultValue
    }, {
      type: 'number',
      value: contentOptimizerDataType
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-getContentIntWithoutCache');
      return;
    }
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_INT_WITHOUT_CACHE, [variableName, defaultValue, contentOptimizerDataType]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "visitHomePage", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_HOME_PAGE, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "visitListingPage", function (taxonomy) {
    if (Utils.checkParameters([{
      type: 'object',
      value: taxonomy
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-visitListingPage');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_LISTING_PAGE, [taxonomy]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "visitProductDetailPage", function (product) {
    if (Utils.checkParameters([{
      type: 'object',
      value: product
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-visitProductDetailPage');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_PRODUCT_DETAIL_PAGE, [product.productMustMap, product.productOptMap]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "visitCartPage", function (products) {
    if (Utils.checkParameters([{
      type: 'object',
      value: products
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-visitCartPage');
      return;
    }
    try {
      var productMap = {};
      var mappedProducts = new Array(products.length);
      products.forEach(function (product, i) {
        productMap['productMustMap'] = product.productMustMap;
        productMap['productOptMap'] = product.productOptMap;
        mappedProducts[i] = productMap;
      });
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_CART_PAGE, [mappedProducts]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "startTrackingGeofence", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.START_TRACKING_GEOFENCE, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "setGDPRConsent", function (gdprConsent) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: gdprConsent
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-setGDPRConsent');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_GDPR_CONSENT, [gdprConsent.toString().toLowerCase()]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "setMobileAppAccess", function (mobileAppAccess) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: mobileAppAccess
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-setMobileAppAccess');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_MOBILE_APP_ACCESS, [mobileAppAccess.toString().toLowerCase()]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "enableIDFACollection", function (idfaCollection) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: idfaCollection
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-enableIDFACollection');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_IDFA_COLLECTION, [idfaCollection.toString().toLowerCase()]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "removeInapp", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.REMOVE_IN_APP, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "registerWithQuietPermission", function (permission) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: permission
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-registerWithQuietPermission');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.REGISTER_WITH_QUIET_PERMISSION, [permission.toString().toLowerCase()]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "setPushToken", function (token) {
    if (Utils.checkParameters([{
      type: 'string',
      value: token
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-setPushToken');
      return;
    }
    try {
      if (cordova.platformId !== InsiderConstants.ANDROID) return;
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_HYBRID_PUSH_TOKEN, [token]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "enableLocationCollection", function (locationCollection) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: locationCollection
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-enableLocationCollection');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_LOCATION_COLLECTION, [locationCollection]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "enableIpCollection", function (ipCollection) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: ipCollection
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-enableIpCollection');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_IP_COLLECTION, [ipCollection]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "enableCarrierCollection", function (carrierCollection) {
    if (Utils.checkParameters([{
      type: 'boolean',
      value: carrierCollection
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-enableCarrierCollection');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_CARRIER_COLLECTION, [carrierCollection]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "signUpConfirmation", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SIGN_UP_CONFIRMATION, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "identifier", function () {
    try {
      return new InsiderIdentifier();
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "setActiveForegroundPushView", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_ACTIVE_FOREGROUND_PUSH_VIEW, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "setForegroundPushCallback", function (callback) {
    if (Utils.checkParameters([{
      type: 'function',
      value: callback
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-setForegroundPushCallback');
      return;
    }
    try {
      if (cordova.platformId === "ios") {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_FOREGROUND_PUSH_CALLBACK, []);
        document.addEventListener('ins_foreground_push_callback', function (data) {
          data && callback(data);
        }, false);
      }
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "handleNotification", function (userInfo) {
    if (Utils.checkParameters([{
      type: 'object',
      value: userInfo
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-setForegroundPushCallback');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.HANDLE_NOTIFICATION, [userInfo]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "getInsiderID", function () {
    try {
      return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_INSIDER_ID, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      return null;
    }
  });
  _defineProperty(this, "registerInsiderIDListener", function (insiderIDCallback) {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.REGISTER_INSIDER_ID_LISTENER, []);
      document.addEventListener('ins_insider_id_listener', function (event) {
        if (event.insiderID) {
          insiderIDCallback(event.insiderID);
        }
      }, false);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "disableInAppMessages", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.DISABLE_IN_APP_MESSAGES, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "enableInAppMessages", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_IN_APP_MESSAGES, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "itemAddedToWishlist", function (product) {
    if (Utils.checkParameters([{
      type: 'object',
      value: product
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-itemAddedToWishlist');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_ADDED_TO_WISHLIST, [product.productMustMap, product.productOptMap]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "itemRemovedFromWishlist", function (productID) {
    if (Utils.checkParameters([{
      type: 'string',
      value: productID
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-itemRemovedFromWishlist');
      return;
    }
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_REMOVED_FROM_WISHLIST, [productID]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "wishlistCleared", function () {
    try {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.WISHLIST_CLEARED, []);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  _defineProperty(this, "visitWishlistPage", function (products) {
    if (Utils.checkParameters([{
      type: 'object',
      value: products
    }])) {
      Utils.showParameterWarningLog(_this.constructor.name + '-visitWishlistPage');
      return;
    }
    try {
      var productMap = {};
      var mappedProducts = new Array(products.length);
      products.forEach(function (product, i) {
        productMap['productMustMap'] = product.productMustMap;
        productMap['productOptMap'] = product.productOptMap;
        mappedProducts[i] = productMap;
      });
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_WISHLIST_PAGE, [mappedProducts]);
    } catch (error) {
      Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
  this.insiderUser = new InsiderUser();
});
module.exports = new InsiderPlugin();