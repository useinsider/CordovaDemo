cordova.define("cordova-plugin-insider.Product", function(require, exports, module) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var InsiderConstants = require("./Constants");
var Utils = require("./Utils");
var Product = /*#__PURE__*/function () {
  function Product(productID, name, taxonomy, imageURL, price, currency) {
    _classCallCheck(this, Product);
    _defineProperty(this, "requiredFields", {});
    _defineProperty(this, "optionalFields", {});
    _defineProperty(this, "customParameters", []);
    this.requiredFields = {
      product_id: productID,
      name: name,
      taxonomy: taxonomy,
      image_url: imageURL,
      unit_price: price,
      currency: currency
    };
  }
  return _createClass(Product, [{
    key: "setColor",
    value: function setColor(color) {
      if (Utils.checkParameters([{
        type: 'string',
        value: color
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-color');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.COLOR] = color;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setVoucherName",
    value: function setVoucherName(voucherName) {
      if (Utils.checkParameters([{
        type: 'string',
        value: voucherName
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-voucherName');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.VOUCHER_NAME] = voucherName;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setPromotionName",
    value: function setPromotionName(promotionName) {
      if (Utils.checkParameters([{
        type: 'string',
        value: promotionName
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-promotionName');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.PROMOTION_NAME] = promotionName;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setSize",
    value: function setSize(size) {
      if (Utils.checkParameters([{
        type: 'string',
        value: size
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-size');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.SIZE] = size;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setGroupCode",
    value: function setGroupCode(groupCode) {
      if (Utils.checkParameters([{
        type: 'string',
        value: groupCode
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-groupCode');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.GROUP_CODE] = groupCode;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setSalePrice",
    value: function setSalePrice(salePrice) {
      if (Utils.checkParameters([{
        type: 'number',
        value: salePrice
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-salePrice');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.SALE_PRICE] = salePrice;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setShippingCost",
    value: function setShippingCost(shippingCost) {
      if (Utils.checkParameters([{
        type: 'number',
        value: shippingCost
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-shippingCost');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.SHIPPING_COST] = shippingCost;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setVoucherDiscount",
    value: function setVoucherDiscount(voucherDiscount) {
      if (Utils.checkParameters([{
        type: 'number',
        value: voucherDiscount
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-voucherDiscount');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.VOUCHER_DISCOUNT] = voucherDiscount;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setPromotionDiscount",
    value: function setPromotionDiscount(promotionDiscount) {
      if (Utils.checkParameters([{
        type: 'number',
        value: promotionDiscount
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-promotionDiscount');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.PROMOTION_DISCOUNT] = promotionDiscount;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setStock",
    value: function setStock(stock) {
      if (Utils.checkParameters([{
        type: 'number',
        value: stock
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-stock');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.STOCK] = stock;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setQuantity",
    value: function setQuantity(quantity) {
      if (Utils.checkParameters([{
        type: 'number',
        value: quantity
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-quantity');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.QUANTITY] = quantity;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setBrand",
    value: function setBrand(brand) {
      if (Utils.checkParameters([{
        type: 'string',
        value: brand
      }]) || !brand) {
        Utils.showParameterWarningLog(this.constructor.name + '-brand');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.BRAND] = brand;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setGender",
    value: function setGender(gender) {
      if (Utils.checkParameters([{
        type: 'string',
        value: gender
      }]) || !gender) {
        Utils.showParameterWarningLog(this.constructor.name + '-gender');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.PRODUCT_GENDER] = gender;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setDescription",
    value: function setDescription(description) {
      if (description == null) {
        Utils.showParameterWarningLog(this.constructor.name + '-description');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.DESCRIPTION] = description;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setSku",
    value: function setSku(sku) {
      if (sku == null) {
        Utils.showParameterWarningLog(this.constructor.name + '-sku');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.SKU] = sku;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setMultipack",
    value: function setMultipack(multipack) {
      if (multipack == null) {
        Utils.showParameterWarningLog(this.constructor.name + '-multipack');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.MULTIPACK] = multipack;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setProductType",
    value: function setProductType(productType) {
      if (productType == null) {
        Utils.showParameterWarningLog(this.constructor.name + '-productType');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.PRODUCT_TYPE] = productType;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setGtin",
    value: function setGtin(gtin) {
      if (gtin == null) {
        Utils.showParameterWarningLog(this.constructor.name + '-gtin');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.GTIN] = gtin;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setTags",
    value: function setTags(tags) {
      if (tags == null || !Array.isArray(tags)) {
        Utils.showParameterWarningLog(this.constructor.name + '-tags');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.TAGS] = tags;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setInStock",
    value: function setInStock(isInStock) {
      if (typeof isInStock !== 'boolean') {
        Utils.showParameterWarningLog(this.constructor.name + '-isInStock');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.IS_IN_STOCK] = isInStock;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setProductURL",
    value: function setProductURL(productURL) {
      if (Utils.checkParameters([{
        type: 'string',
        value: productURL
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-productURL');
        return this;
      }
      try {
        this.optionalFields[InsiderConstants.PRODUCT_URL] = productURL;
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
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
        this.customParameters.push({
          type: 'string',
          key: key,
          value: value
        });
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
        this.customParameters.push({
          type: 'integer',
          key: key,
          value: value
        });
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
        this.customParameters.push({
          type: 'boolean',
          key: key,
          value: value
        });
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
        this.customParameters.push({
          type: 'double',
          key: key,
          value: value
        });
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
        // Use epoch milliseconds as string instead of ISO string
        this.customParameters.push({
          type: 'date',
          key: key,
          value: value.getTime().toString()
        });
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
        // Default to strings array for backward compatibility
        this.customParameters.push({
          type: 'strings',
          key: key,
          value: value
        });
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithStringArray",
    value: function setCustomAttributeWithStringArray(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'string_array',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithStringArray');
        return this;
      }
      try {
        this.customParameters.push({
          type: 'strings',
          key: key,
          value: value
        });
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }, {
    key: "setCustomAttributeWithNumericArray",
    value: function setCustomAttributeWithNumericArray(key, value) {
      if (Utils.checkParameters([{
        type: 'string',
        value: key
      }, {
        type: 'numeric_array',
        value: value
      }])) {
        Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithNumericArray');
        return this;
      }
      try {
        this.customParameters.push({
          type: 'numbers',
          key: key,
          value: value
        });
      } catch (error) {
        Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
      return this;
    }
  }]);
}();
module.exports = Product;
});
