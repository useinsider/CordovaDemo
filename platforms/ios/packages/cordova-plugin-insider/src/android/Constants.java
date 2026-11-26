package com.useinsider.cordova;

class Constants {
    private Constants() {
        throw new IllegalStateException("Utility class");
    }
    
    static final String ADD_OBJECTS_TO_CUSTOM_ATTRIBUTE = "addObjectsToCustomAttribute";
    static final String MERGE_OBJECTS_IN_CUSTOM_ATTRIBUTE = "mergeObjectsInCustomAttribute";
    static final String REMOVE_OBJECTS_FROM_CUSTOM_ATTRIBUTE = "removeObjectsFromCustomAttribute";
    static final String HANDLE_NOTIFICATION = "handleNotification";
    static final String TRIGGER_PUSH_PROCESS_WITH_NOTIFICATION_DATA = "triggerPushProcessWithNotificationData";
    static final String SET_INTERNAL_BROWSER_CLOSE_BUTTON_POSITION = "setInternalBrowserCloseButtonPosition";
    static final String SET_PROMOTIONAL_OPTIN = "setPromotionalOptin";

    // Action names sent by js/Constants.js; changing a value breaks the bridge.
    static final String ADD_EMAIL = "addEmail";
    static final String ADD_PHONE_NUMBER = "addPhoneNumber";
    static final String ADD_USER_ID = "addUserID";
    static final String CART_CLEARED = "cartCleared";
    static final String CLICK_SMART_RECOMMENDATION_PRODUCT = "clickSmartRecommendationProduct";
    static final String GET_MESSAGE_CENTER_DATA = "getMessageCenterData";
    static final String GET_SMART_RECOMMENDATION = "getSmartRecommendation";
    static final String GET_SMART_RECOMMENDATION_WITH_PRODUCT = "getSmartRecommendationWithProduct";
    static final String ITEM_ADDED_TO_CART = "itemAddedToCart";
    static final String ITEM_PURCHASED = "itemPurchased";
    static final String ITEM_REMOVED_FROM_CART = "itemRemovedFromCart";
    static final String LOGIN = "login";
    static final String LOGOUT = "logout";
    static final String REGISTER_WITH_QUIET_PERMISSION = "registerWithQuietPermission";
    static final String SET_AGE = "setAge";
    static final String SET_BIRTHDAY = "setBirthday";
    static final String SET_CUSTOM_ATTRIBUTE_WITH_ARRAY = "setCustomAttributeWithArray";
    static final String SET_CUSTOM_ATTRIBUTE_WITH_BOOLEAN = "setCustomAttributeWithBoolean";
    static final String SET_CUSTOM_ATTRIBUTE_WITH_DATE = "setCustomAttributeWithDate";
    static final String SET_CUSTOM_ATTRIBUTE_WITH_DOUBLE = "setCustomAttributeWithDouble";
    static final String SET_CUSTOM_ATTRIBUTE_WITH_INT = "setCustomAttributeWithInt";
    static final String SET_CUSTOM_ATTRIBUTE_WITH_STRING = "setCustomAttributeWithString";
    static final String SET_EMAIL_OPTIN = "setEmailOptin";
    static final String SET_FACEBOOK_ID = "setFacebookID";
    static final String SET_GENDER = "setGender";
    static final String SET_LANGUAGE = "setLanguage";
    static final String SET_LOCALE = "setLocale";
    static final String SET_LOCATION_OPTIN = "setLocationOptin";
    static final String SET_NAME = "setName";
    static final String SET_PUSH_OPTIN = "setPushOptin";
    static final String SET_SMS_OPTIN = "setSMSOptin";
    static final String SET_SURNAME = "setSurname";
    static final String SET_TWITTER_ID = "setTwitterID";
    static final String SET_WHATSAPP_OPTIN = "setWhatsappOptin";
    static final String TAG_EVENT = "tagEvent";
    static final String UNSET_CUSTOM_ATTRIBUTE = "unsetCustomAttribute";
    static final String VISIT_CART_PAGE = "visitCartPage";
    static final String VISIT_HOME_PAGE = "visitHomePage";
    static final String VISIT_LISTING_PAGE = "visitListingPage";
    static final String VISIT_PRODUCT_DETAIL_PAGE = "visitProductDetailPage";

    static final String ERROR = "error";
    static final String DEFAULT_VALUE = "defaultValue";
    static final String VARIABLE_NAME = "variableName";
    static final String KEY = "key";
    static final String VALUE = "value";
    static final String DATA_TYPE = "dataType";
    static final String RECOMMENDATION_ID = "recommendationID";
    static final String LOCALE = "locale";
    static final String RECOMMENDATION_LOG = "[INSIDER][loadRecommendationData]";
    static final String MESSAGE_CENTER_LOG = "[INSIDER][messageCenterData]";
    static final String EXCEPTION = "exception";
    static final String ENDPOINT = "endpoint";
    static final String CURRENCY = "currency";
    static final String START_DATE = "startDate";
    static final String END_DATE = "endDate";
    static final String LIMIT = "limit";

    static final String PRODUCT_ID = "product_id";
    static final String NAME = "name";
    static final String TAXONOMY = "taxonomy";
    static final String UNIT_PRICE = "unit_price";
    static final String IMAGE_URL = "image_url";
    static final String SALE_PRICE = "sale_price";
    static final String STOCK = "stock";
    static final String COLOR = "color";
    static final String SIZE = "size";
    static final String QUANTITY = "quantity";
    static final String SHIPPING_COST = "shipping_cost";
    static final String VOUCHER_NAME = "voucher_name";
    static final String VOUCHER_DISCOUNT = "voucher_discount";
    static final String PROMOTION_NAME = "promotion_name";
    static final String PROMOTION_DISCOUNT = "promotion_discount";
    static final String GROUP_CODE = "groupcode";
    static final String BRAND = "brnd";
    static final String SKU = "sku";
    static final String PRODUCT_GENDER = "ge";
    static final String MULTIPACK = "mlt";
    static final String PRODUCT_TYPE = "pt";
    static final String GTIN = "gt";
    static final String DESCRIPTION = "desc";
    static final String TAGS = "tags";
    static final String IS_IN_STOCK = "iis";
    static final String PRODUCT_URL = "product_url";
}
