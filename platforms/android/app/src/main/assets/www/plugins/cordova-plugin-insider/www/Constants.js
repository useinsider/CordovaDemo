cordova.define("cordova-plugin-insider.Constants", function(require, exports, module) {
module.exports = {
    // Main Class Name
    CLASS: 'InsiderPlugin',
    // User
    SET_GENDER: 'setGender',
    SET_BIRTDAY: 'setBirthday',
    SET_NAME: 'setName',
    SET_SURNAME: 'setSurname',
    SET_AGE: 'setAge',
    SET_EMAIL: 'setEmail',
    SET_PHONE_NUMBER: 'setPhoneNumber',
    SET_LANGUAGE: 'setLanguage',
    SET_LOCALE: 'setLocale',
    SET_FACEBOOK_ID: 'setFacebookID',
    SET_TWITTER_ID: 'setTwitterID',
    SET_EMAIL_OPTIN: 'setEmailOptin',
    SET_SMS_OPTIN: 'setSMSOptin',
    SET_PUSH_OPTIN: 'setPushOptin',
    SET_LOCATION_OPTIN: 'setLocationOptin',
    SET_WHATSAPP_OPTIN: 'setWhatsappOptin',
    LOGIN: 'login',
    LOGOUT: 'logout',
    SET_CUSTOM_ATTRIBUTE_WITH_STRING: 'setCustomAttributeWithString',
    SET_CUSTOM_ATTRIBUTE_WITH_INT: 'setCustomAttributeWithInt',
    SET_CUSTOM_ATTRIBUTE_WITH_DOUBLE: 'setCustomAttributeWithDouble',
    SET_CUSTOM_ATTRIBUTE_WITH_BOOLEAN: 'setCustomAttributeWithBoolean',
    SET_CUSTOM_ATTRIBUTE_WITH_DATE: 'setCustomAttributeWithDate',
    SET_CUSTOM_ATTRIBUTE_WITH_ARRAY: 'setCustomAttributeWithArray',
    UNSET_CUSTOM_ATTRIBUTE: 'unsetCustomAttribute',
    // User Identifier
    ADD_EMAIL: 'addEmail',
    ADD_PHONE_NUMBER: 'addPhoneNumber',
    ADD_USER_ID: 'addUserID',
    // Insider Functions
    INIT_WITH_CUSTOM_ENDPOINT: 'initWithCustomEndpoint',
    INIT_WITH_LAUNCH_OPTIONS: 'initWithLaunchOptions',
    INIT: 'init',
    ITEM_PURCHASED: 'itemPurchased',
    ITEM_ADDED_TO_CART: 'itemAddedToCart',
    ITEM_REMOVED_FROM_CART: 'itemRemovedFromCart',
    CART_CLEARED: 'cartCleared',
    GET_MESSAGE_CENTER_DATA: 'getMessageCenterData',
    GET_SMART_RECOMMENDATION: 'getSmartRecommendation',
    GET_SMART_RECOMMENDATION_WITH_PRODUCT: 'getSmartRecommendationWithProduct',
    GET_SMART_RECOMMENDATION_WITH_PRODUCT_IDS: 'getSmartRecommendationWithProductIDs',
    CLICK_SMART_RECOMMENDATION_PRODUCT: 'clickSmartRecommendationProduct',
    GET_CONTENT_STRING_WITH_NAME: 'getContentStringWithName',
    GET_CONTENT_BOOL_WITH_NAME: 'getContentBoolWithName',
    GET_CONTENT_INT_WITH_NAME: 'getContentIntWithName',
    VISIT_HOME_PAGE: 'visitHomePage',
    VISIT_LISTING_PAGE: 'visitListingPage',
    VISIT_PRODUCT_DETAIL_PAGE: 'visitProductDetailPage',
    VISIT_CART_PAGE: 'visitCartPage',
    START_TRACKING_GEOFENCE: 'startTrackingGeofence',
    SET_GDPR_CONSENT: 'setGDPRConsent',
    REMOVE_IN_APP: 'removeInapp',
    REGISTER_WITH_QUIET_PERMISSION: 'registerWithQuietPermission',
    SET_HYBRID_PUSH_TOKEN: 'setHybridPushToken',
    ENABLE_IDFA_COLLECTION: 'enableIDFACollection',
    ENABLE_LOCATION_COLLECTION: 'enableLocationCollection',
    ENABLE_IP_COLLECTION: 'enableIpCollection',
    ENABLE_CARRIER_COLLECTION: 'enableCarrierCollection',
    SIGN_UP_CONFIRMATION: 'signUpConfirmation',
    SET_ACTIVE_FOREGROUND_PUSH_VIEW: 'setActiveForegroundPushView',
    SET_FOREGROUND_PUSH_CALLBACK: 'setForegroundPushCallback',
    HANDLE_NOTIFICATION: 'handleNotification',
    // Event
    TAG_EVENT: 'tagEvent',
    // Product Attribute
    SALE_PRICE: 'sale_price',
    STOCK: 'stock',
    COLOR: 'color',
    SIZE: 'size',
    QUANTITY: 'quantity',
    SHIPPING_COST: 'shipping_cost',
    VOUCHER_NAME: 'voucher_name',
    VOUCHER_DISCOUNT: 'voucher_discount',
    PROMOTION_NAME: 'promotion_name',
    PROMOTION_DISCOUNT: 'promotion_discount',
    GROUP_CODE: 'groupcode',
    // Error
    PUT_ERROR_LOG: 'putErrorLog',
    // Platform
    ANDROID: 'android',
    IOS: 'ios',
    // SDK Version
    SDK_VERSION: 'CDV-1.4.0',
};

});
