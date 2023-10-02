"use strict";

const InsiderConstants = require("./Constants");
const Utils = require("./Utils");

class Product {
    productMustMap = {};
    productOptMap = {};

    constructor(productID, name, taxonomy, imageURL, price, currency) {
        this.productMustMap = {
            product_id: productID,
            name: name,
            taxonomy: taxonomy,
            image_url: imageURL,
            unit_price: price,
            currency: currency,
        };
    }

    setColor(color) {
        if (Utils.checkParameters([{ type: 'string', value: color }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-color');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.COLOR] = color;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setVoucherName(voucherName) {
        if (Utils.checkParameters([{ type: 'string', value: voucherName }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-voucherName');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.VOUCHER_NAME] = voucherName;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setPromotionName(promotionName) {
        if (Utils.checkParameters([{ type: 'string', value: promotionName }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-promotionName');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.PROMOTION_NAME] = promotionName;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setSize(size) {
        if (Utils.checkParameters([{ type: 'string', value: size }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-size');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.SIZE] = size;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setGroupCode(groupCode) {
        if (Utils.checkParameters([{ type: 'string', value: groupCode }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-groupCode');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.GROUP_CODE] = groupCode;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setSalePrice(salePrice) {
        if (Utils.checkParameters([{ type: 'number', value: salePrice }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-salePrice');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.SALE_PRICE] = salePrice;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setShippingCost(shippingCost) {
        if (Utils.checkParameters([{ type: 'number', value: shippingCost }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-shippingCost');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.SHIPPING_COST] = shippingCost;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setVoucherDiscount(voucherDiscount) {
        if (Utils.checkParameters([{ type: 'number', value: voucherDiscount }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-voucherDiscount');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.VOUCHER_DISCOUNT] = voucherDiscount;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setPromotionDiscount(promotionDiscount) {
        if (Utils.checkParameters([{ type: 'number', value: promotionDiscount }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-promotionDiscount');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.PROMOTION_DISCOUNT] = promotionDiscount;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setStock(stock) {
        if (Utils.checkParameters([{ type: 'number', value: stock }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-stock');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.STOCK] = stock;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setQuantity(quantity) {
        if (Utils.checkParameters([{ type: 'number', value: quantity }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-quantity');
            return this;
        }

        try {
            this.productOptMap[InsiderConstants.QUANTITY] = quantity;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithString(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'string', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithString');
            return this;
        }

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithInt(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'number', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithInt');
            return this;
        }

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setCustomAttributeWithBoolean(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'boolean', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithBoolean');
            return this;
        }

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setCustomAttributeWithDouble(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'number', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithDouble');
            return this;
        }

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithDate(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'object', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithDate');
            return this;
        }

        try {
            this.productOptMap[key] = value.toISOString();
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithArray(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'object', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithArray');
            return this;
        }

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }
}

module.exports = Product;