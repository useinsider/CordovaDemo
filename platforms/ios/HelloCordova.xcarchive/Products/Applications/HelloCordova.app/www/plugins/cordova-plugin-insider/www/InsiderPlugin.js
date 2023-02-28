cordova.define("cordova-plugin-insider.InsiderPlugin", function(require, exports, module) {
"use strict";

let InsiderProduct = require("./Product");
let InsiderEvent = require("./Event");
let InsiderUser = require("./User");
let InsiderIdentifier = require('./Identifier');
let InsiderCallbackType = require('./CallbackType');
let InsiderGender = require('./Gender');
let InsiderContentOptimizerDataType = require('./ContentOptimizerDataType');

const Utils = require("./Utils");
const InsiderConstants = require("./Constants");

class InsiderPlugin {
    insiderUser = {};
    gender = InsiderGender;
    callbackType = InsiderCallbackType;
    contentOptimizerDataType = InsiderContentOptimizerDataType;

    constructor() {
        this.insiderUser = new InsiderUser();
    }

    initCordovaBase = (partnerName, appGroup, customEndpoint, handleNotificationCallback) => {
        try {
            const sdkVersion = InsiderConstants.SDK_VERSION;

            document.addEventListener('ins_notification_handle', handleNotificationCallback, false);

            if (customEndpoint !== null)
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.INIT_WITH_CUSTOM_ENDPOINT, [partnerName, sdkVersion, appGroup, customEndpoint]);
            else if (cordova.platformId === "ios")
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.INIT_WITH_LAUNCH_OPTIONS, [partnerName, sdkVersion, appGroup]);
            else
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.INIT, [partnerName, sdkVersion]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    init = (partnerName, appGroup, handleNotificationCallback) => {
        if (partnerName === null || appGroup === null || handleNotificationCallback === null) return;

        try {
            this.initCordovaBase(partnerName, appGroup, null, handleNotificationCallback);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    };

    initWithCustomEndpoint = (partnerName, appGroup, endpoint, handleNotificationCallback) => {
        if (partnerName === null || appGroup === null || endpoint === null || handleNotificationCallback === null) return;

        try {
            this.initCordovaBase(partnerName, appGroup, endpoint, handleNotificationCallback);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getCurrentUser = () => {
        try {
            return this.insiderUser;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    tagEvent = (eventName) => {
        if (eventName === null) { Utils.showWarning('eventName'); return; }
        try {
            return new InsiderEvent(eventName);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    createNewProduct = (productID, name, taxonomy, imageURL, price, currency) => {
        if (productID === null || name === null || taxonomy === null || imageURL === null || price === null || currency === null || Utils.isEmpty(taxonomy) || Utils.isEmpty(price))
            return new InsiderProduct('', '', [], '', 0, '');

        return new InsiderProduct(productID, name, taxonomy, imageURL, price, currency);
    }

    itemPurchased = (uniqueSaleID, product) => {
        if (uniqueSaleID === null || product === null) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_PURCHASED, [uniqueSaleID, product.productMustMap, product.productOptMap]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    itemAddedToCart = (product) => {
        if (product === null) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_ADDED_TO_CART, [product.productMustMap, product.productOptMap]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    itemRemovedFromCart = (productID) => {
        if (productID === null) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ITEM_REMOVED_FROM_CART, [productID]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    cartCleared = () => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.CART_CLEARED, []);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getMessageCenterData = (limit, startDate, endDate) => {
        if (limit === null || startDate === null || endDate === null || startDate.getTime() === endDate.getTime() || startDate.getTime() > endDate.getTime()) return;

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_MESSAGE_CENTER_DATA, [limit, startDate, endDate]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getSmartRecommendation = (recommendationID, locale, currency) => {
        if (recommendationID === null || locale === null || currency === null) return;

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_SMART_RECOMMENDATION, [recommendationID, locale, currency]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getSmartRecommendationWithProduct = (product, recommendationID, locale) => {
        if (product === null || recommendationID === null || locale === null) return;

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_SMART_RECOMMENDATION_WITH_PRODUCT, [product.productMustMap, product.productOptMap, recommendationID, locale]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getSmartRecommendationWithProductIDs = (productIDs, recommendationID, locale, currency) => {
        if (productIDs === null || recommendationID === null || locale === null || currency === null) return;

        productIDs = productIDs.filter(value => value != null && typeof value == "string" && value.trim());

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_SMART_RECOMMENDATION_WITH_PRODUCT_IDS, [productIDs, recommendationID, locale, currency]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    clickSmartRecommendationProduct = (product, recommendationID) => {
        if (product === null || recommendationID === null) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.CLICK_SMART_RECOMMENDATION_PRODUCT, [product.productMustMap, product.productOptMap, recommendationID]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getContentStringWithName = (variableName, defaultValue, contentOptimizerDataType) => {
        if (defaultValue === null || contentOptimizerDataType === null) return;

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_STRING_WITH_NAME, [variableName, defaultValue, contentOptimizerDataType]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getContentBoolWithName = (variableName, defaultValue, contentOptimizerDataType) => {
        if (variableName === null || defaultValue === null || contentOptimizerDataType === null) return;

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_BOOL_WITH_NAME, [variableName, defaultValue, contentOptimizerDataType]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    getContentIntWithName = (variableName, defaultValue, contentOptimizerDataType) => {
        if (variableName === null || defaultValue === null || contentOptimizerDataType === null) return;

        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.GET_CONTENT_INT_WITH_NAME, [variableName, defaultValue, contentOptimizerDataType]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    visitHomePage = () => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_HOME_PAGE, []);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    visitListingPage = (taxonomy) => {
        if (taxonomy === null) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_LISTING_PAGE, [taxonomy]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    visitProductDetailPage = (product) => {
        if (product === null) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_PRODUCT_DETAIL_PAGE, [product.productMustMap, product.productOptMap]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    visitCartPage = (products) => {
        if (products === null) return;
        try {
            let productMap = {};
            let mappedProducts = new Array(products.length);
            products.forEach((product, i) => {
                productMap['productMustMap'] = product.productMustMap;
                productMap['productOptMap'] = product.productOptMap;

                mappedProducts[i] = productMap;
            });

            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.VISIT_CART_PAGE, [mappedProducts]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    startTrackingGeofence = () => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.START_TRACKING_GEOFENCE, []);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    setGDPRConsent = (gdprConsent) => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_GDPR_CONSENT, [gdprConsent.toString().toLowerCase()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    };

    enableIDFACollection = (idfaCollection) => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_IDFA_COLLECTION, [idfaCollection.toString().toLowerCase()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    };

    removeInapp = () => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.REMOVE_IN_APP, []);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    };

    registerWithQuietPermission = (permission) => {
        if (cordova.platformId !== InsiderConstants.IOS) return;

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.REGISTER_WITH_QUIET_PERMISSION, [permission.toString().toLowerCase()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    };

    setHybridPushToken = (token) => {
        if (stoken === null) return;

        try {
            if (Platform.OS !== InsiderConstants.ANDROID) return;

            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_HYBRID_PUSH_TOKEN, [token]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    enableLocationCollection = (locationCollection) => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_LOCATION_COLLECTION, [locationCollection]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    enableIpCollection = (ipCollection) => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_IP_COLLECTION, [ipCollection]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    enableCarrierCollection = (carrierCollection) => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.ENABLE_CARRIER_COLLECTION, [carrierCollection]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    signUpConfirmation = () => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SIGN_UP_CONFIRMATION, []);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    identifier = () => {
        try {
            return new InsiderIdentifier();
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    setActiveForegroundPushView = () => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_ACTIVE_FOREGROUND_PUSH_VIEW, []);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    setForegroundPushCallback = (callback) => {
        try {
            if (cordova.platformId === "ios") {
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_FOREGROUND_PUSH_CALLBACK, []);

                document.addEventListener('ins_foreground_push_callback', (data) => {
                    data && callback(data);
                }, false);
            }
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    handleNotification = (userInfo) => {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.HANDLE_NOTIFICATION, [userInfo]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }
}

module.exports = new InsiderPlugin();

});
