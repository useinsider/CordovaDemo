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
        if (color === null|| Utils.isEmpty(color)){ Utils.showWarning(this.constructor.name + '-color'); return this;}

        try {
            this.productOptMap[InsiderConstants.COLOR] = color;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setVoucherName(voucherName) {
        if (voucherName === null|| Utils.isEmpty(voucherName)){ Utils.showWarning(this.constructor.name + '-voucherName'); return this;}

        try {
            this.productOptMap[InsiderConstants.VOUCHER_NAME] = voucherName;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setPromotionName(promotionName) {
        if (promotionName === null|| Utils.isEmpty(promotionName)){ Utils.showWarning(this.constructor.name + '-promotionName'); return this;}

        try {
            this.productOptMap[InsiderConstants.PROMOTION_NAME] = promotionName;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        
        return this;
    }

    setSize(size) {
        if (size === null|| Utils.isEmpty(size)){ Utils.showWarning(this.constructor.name + '-size'); return this;}

        try {
            this.productOptMap[InsiderConstants.SIZE] = size;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setGroupCode(groupCode) {
        if (!groupCode) { Utils.showWarning(this.constructor.name + '-groupCode'); return this; }

        try {
            this.productOptMap[InsiderConstants.GROUP_CODE] = groupCode;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setSalePrice(salePrice) {
        if (salePrice === null|| Utils.isEmpty(salePrice)){ Utils.showWarning(this.constructor.name + '-salePrice'); return this;}

        try {
            this.productOptMap[InsiderConstants.SALE_PRICE] = salePrice;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setShippingCost(shippingCost) {
        if (shippingCost === null|| Utils.isEmpty(shippingCost)){ Utils.showWarning(this.constructor.name + '-shippingCost'); return this;}

        try {
            this.productOptMap[InsiderConstants.SHIPPING_COST] = shippingCost;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setVoucherDiscount(voucherDiscount) {
        if (voucherDiscount === null|| Utils.isEmpty(voucherDiscount)){ Utils.showWarning(this.constructor.name + '-voucherDiscount'); return this;}

        try {
            this.productOptMap[InsiderConstants.VOUCHER_DISCOUNT] = voucherDiscount;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setPromotionDiscount(promotionDiscount) {
        if (promotionDiscount === null|| Utils.isEmpty(promotionDiscount)){ Utils.showWarning(this.constructor.name + '-promotionDiscount'); return this;}

        try {
            this.productOptMap[InsiderConstants.PROMOTION_DISCOUNT] = promotionDiscount;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setStock(stock) {
        if (stock === null|| Utils.isEmpty(stock)){ Utils.showWarning(this.constructor.name + '-stock'); return this;}

        try {
            this.productOptMap[InsiderConstants.STOCK] = stock;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setQuantity(quantity) {
        if (quantity === null|| Utils.isEmpty(quantity)|| Utils.isEmpty(quantity)){ Utils.showWarning(this.constructor.name + '-quantity'); return this;}

        try {
            this.productOptMap[InsiderConstants.QUANTITY] = quantity;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithString(key, value) {
        if (key === null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithString key or value'); return this;}

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithInt(key, value) {
        if (key === null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithInt key or value'); return this;}

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setCustomAttributeWithBoolean(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithBoolean key or value'); return this;}

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setCustomAttributeWithDouble(key, value) {
        if (key === null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithDouble key or value'); return this;}

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithDate(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithDate key or value'); return this;}

        try {
            this.productOptMap[key] = value.toISOString();
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithArray(key, value) {
        if (key === null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithArray key or value'); return this;}

        try {
            this.productOptMap[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }
}

module.exports = Product;