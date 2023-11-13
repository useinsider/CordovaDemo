package com.useinsider.cordova;

import static com.useinsider.insider.InsiderCallbackType.INAPP_BUTTON_CLICK;
import static com.useinsider.insider.InsiderCallbackType.NOTIFICATION_OPEN;
import static com.useinsider.insider.InsiderCallbackType.TEMP_STORE_ADDED_TO_CART;
import static com.useinsider.insider.InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION;
import static com.useinsider.insider.InsiderCallbackType.TEMP_STORE_PURCHASE;

import android.app.Application;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.RemoteMessage;
import com.huawei.hms.push.HmsMessageService;
import com.useinsider.insider.ContentOptimizerDataType;
import com.useinsider.insider.Insider;
import com.useinsider.insider.InsiderCallback;
import com.useinsider.insider.InsiderCallbackType;
import com.useinsider.insider.InsiderIdentifiers;
import com.useinsider.insider.InsiderProduct;
import com.useinsider.insider.InsiderUser;
import com.useinsider.insider.MessageCenterData;
import com.useinsider.insider.RecommendationEngine;
import com.useinsider.insiderhybrid.InsiderHybrid;
import com.useinsider.insiderhybrid.InsiderHybridUtils;
import com.useinsider.insiderhybrid.constants.InsiderHybridMethods;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class InsiderPlugin extends CordovaPlugin {
    private boolean isCoreInitialized = false;

    @Override
    protected void pluginInitialize() {
        super.initialize(cordova, webView);
    }

    public void init(final String partnerName, final String sdkVersion) {
        try {
            if (Insider.Instance.isSDKInitialized())
                return;

            cordova.getActivity().runOnUiThread(new Runnable()  {
                @Override
                public void run() {
                    InsiderHybrid.initWithActivity(cordova.getActivity(), partnerName);

                    Insider.Instance.setSDKType("cordova");
                    Insider.Instance.setHybridSDKVersion(sdkVersion);
                    Insider.Instance.resumeSessionHybridConfig(cordova.getActivity());

                    if (isCoreInitialized) {
                        Insider.Instance.resumeSessionHybridRequestConfig();
                    }

                    isCoreInitialized = true;

                    Insider.Instance.registerInsiderCallback(new InsiderCallback() {
                        @Override
                        public void doAction(JSONObject jsonObject, InsiderCallbackType insiderCallbackType) {
                            try {
                                String json = "{'action':'" + insiderCallbackType + "','result':" + jsonObject.toString() + "}";

                                loadHandleUrl(json);
                            } catch (Exception e) {
                                Insider.Instance.putException(e);
                            }
                        }
                    });

                    Insider.Instance.storePartnerName(partnerName);
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    public void loadHandleUrl(String json) {
        webView.loadUrl("javascript:cordova.fireDocumentEvent('ins_notification_handle'," + json + ");");
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (args == null) {
            return false;
        }

        try {
            if (action.equals("init")) {
                init(args.getString(0), args.getString(1));
            } else if (action.equals("initWithCustomEndpoint")) {
                Insider.Instance.setCustomEndpoint(args.getString(3));

                init(args.getString(0), args.getString(1));
            } else if (action.equals("reinitWithPartnerName")) {
                Insider.Instance.reinitWithPartnerName(args.getString(0));
            } else if (action.equals("setGDPRConsent")) {
                Insider.Instance.setGDPRConsent(Boolean.parseBoolean(args.getString(0)));
            } else if (action.equals("startTrackingGeofence")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Insider.Instance.startTrackingGeofence();
                    }
                });
            } else if (action.equals("getContentStringWithName")) {
                ContentOptimizerDataType stringVariableDataType = getDataType(args.getString(2));

                String optimizedString = Insider.Instance.getContentStringWithName(args.getString(0), args.getString(1), stringVariableDataType);

                if (optimizedString != null && optimizedString.length() > 0) {
                    callbackSuccess(callbackContext, optimizedString);
                }
            } else if (action.equals("getContentIntWithName")) {
                ContentOptimizerDataType intVariableDataType = getDataType(args.getString(2));

                int optimizedInteger = Insider.Instance.getContentIntWithName(args.getString(0), args.getInt(1), intVariableDataType);

                callbackSuccess(callbackContext, optimizedInteger);
            } else if (action.equals("getContentBoolWithName")) {
                ContentOptimizerDataType boolVariableDataType = getDataType(args.getString(2));

                boolean optimizedBoolean = Insider.Instance.getContentBoolWithName(args.getString(0), args.getBoolean(1), boolVariableDataType);

                callbackSuccess(callbackContext, optimizedBoolean);
            } else if (action.equals("removeInapp")) {
                Insider.Instance.removeInapp(this.cordova.getActivity());
            } else if (action.equals(InsiderHybridMethods.ITEM_PURCHASED)) {
                if (args.get(0) == null || args.getString(1) == null || args.getString(2) == null)
                    return false;
               cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Map<String, Object> mustMap = null;
                        Map<String, Object> optMap = null;
                        try {
                            mustMap = CDVUtils.convertJSONToMap(args.getString(1));
                            optMap = CDVUtils.convertJSONToMap(args.getString(2));

                            isProductValid(mustMap);
                            InsiderProduct product = createProduct(mustMap, optMap);
                
                            Insider.Instance.itemPurchased(String.valueOf(args.get(0)), product);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (JSONException e) {
                            callbackFailure(callbackContext, e.toString());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.ITEM_ADDED_TO_CART)) {
                if (args.get(0) == null || args.getString(1) == null)
                    return false;

                Map<String, Object> mustMap = CDVUtils.convertJSONToMap(args.getString(0));
                Map<String, Object> optMap = CDVUtils.convertJSONToMap(args.getString(1));

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        InsiderProduct product = createProduct(mustMap, optMap);
                        Insider.Instance.itemAddedToCart(product);
                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals(InsiderHybridMethods.ITEM_REMOVED_FROM_CART)) {
                if (args.get(0) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.itemRemovedFromCart(args.getString(0));
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.CART_CLEARED)) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Insider.Instance.cartCleared();
                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals(InsiderHybridMethods.GET_MESSAGE_CENTER_DATA)) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null)
                    return false;

                cordova.getThreadPool().execute(() -> {
                    try {
                        int limit =args.getInt(0);
                        String startDate  = args.getString(1);
                        String endDate = args.getString(2);

                        InsiderHybrid.getMessageCenterData(limit,startDate,endDate, new MessageCenterData() {
                            @Override
                            public void loadMessageCenterData(JSONArray jsonArray) {
                                callbackSuccess(callbackContext, jsonArray.toString());
                            }
                        });
                    } catch (JSONException e) {
                        callbackFailure(callbackContext, e.toString());
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals(InsiderHybridMethods.GET_SMART_RECOMMENDATION)) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null)
                    return false;

                cordova.getThreadPool().execute(() -> {
                    try {
                        int rId  = args.getInt(0);
                        String locale = args.getString(1);
                        String currency = args.getString(2);
                        Insider.Instance.getSmartRecommendation(rId,locale,currency, new RecommendationEngine.SmartRecommendation() {
                            @Override
                            public void loadRecommendationData(JSONObject jsonObject) {
                                callbackSuccess(callbackContext, jsonObject.toString());
                            }
                        });
                    } catch (JSONException e) {
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals(InsiderHybridMethods.GET_SMART_RECOMMENDATION_WITH_PRODUCT)) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null || args.get(3) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> mustMap = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optMap = CDVUtils.convertJSONToMap(args.getString(1));

                            InsiderProduct product = createProduct(mustMap, optMap);
                            Insider.Instance.getSmartRecommendationWithProduct(product,
                                    args.getInt(2),
                                    args.getString(3),
                                    new RecommendationEngine.SmartRecommendation() {
                                        @Override
                                        public void loadRecommendationData(JSONObject jsonObject) {
                                            callbackSuccess(callbackContext, jsonObject.toString());
                                        }
                                    });
                        } catch (JSONException e) {
                            callbackFailure(callbackContext, "ERROR:" + e.toString());
                            e.printStackTrace();
                        }
                    }
                });
            } else if (action.equals("getSmartRecommendationWithProductIDs")) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null || args.get(3) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String[] productIDs = (CDVUtils.convertJSONToArrayList(args.get(0).toString())).toArray(new String[0]);

                            Insider.Instance.getSmartRecommendationWithProductIDs(productIDs,
                                    args.getInt(1),
                                    args.getString(2),
                                    args.getString(3),
                                    new RecommendationEngine.SmartRecommendation() {
                                        @Override
                                        public void loadRecommendationData(JSONObject jsonObject) {
                                            callbackSuccess(callbackContext, jsonObject.toString());
                                        }
                                    });
                        } catch (JSONException e) {
                            callbackFailure(callbackContext, "ERROR:" + e.toString());
                            e.printStackTrace();
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.CLICK_SMART_RECOMMENDATION_PRODUCT)) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> mustMap = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optMap = CDVUtils.convertJSONToMap(args.getString(1));
                            InsiderProduct recommendationLogProduct = createProduct(mustMap, optMap);
                            Insider.Instance.clickSmartRecommendationProduct(args.getInt(2),recommendationLogProduct);
                            callbackSuccess(callbackContext, "{SUCCESS}");
                        } catch (JSONException e) {
                            callbackFailure(callbackContext, "ERROR:" + e.toString());
                            e.printStackTrace();
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.TAG_EVENT)) {
                if (args.get(0) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> parameters = CDVUtils.convertJSONToMap(args.getString(1));
                            InsiderHybrid.tagEvent(args.getString(0), parameters);

                            callbackSuccess(callbackContext, "{SUCCESS}");
                        } catch (JSONException e) {
                            Insider.Instance.putException(e);
                            callbackFailure(callbackContext, "FAIL");
                        }
                    }
                });

            } else if (action.equals(InsiderHybridMethods.VISIT_HOME_PAGE)) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Insider.Instance.visitHomePage();

                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals(InsiderHybridMethods.VISIT_LISTING_PAGE)) {
                if (args.get(0) == null)
                    return false;

                String[] taxonomy = (CDVUtils.convertJSONToArrayList(args.get(0).toString())).toArray(new String[0]);

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Insider.Instance.visitListingPage(taxonomy);
                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals(InsiderHybridMethods.VISIT_PRODUCT_DETAIL_PAGE)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;

                Map<String, Object> mustMap = CDVUtils.convertJSONToMap(args.getString(0));
                Map<String, Object> optMap = CDVUtils.convertJSONToMap(args.getString(1));

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        InsiderProduct recommendationProduct = createProduct(mustMap, optMap);
                        Insider.Instance.visitProductDetailPage(recommendationProduct);
                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals(InsiderHybridMethods.VISIT_CART_PAGE)) {
                if (args.get(0) == null)
                    return false;

                String json = args.getString(0);
                ArrayList products = new ObjectMapper().readValue(json, ArrayList.class);
                InsiderProduct[] ips = new InsiderProduct[products.size()];

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        for (int i = 0; i < products.size(); i++) {
                            HashMap mustMap = (HashMap)(((LinkedHashMap)products.get(i)).get("productMustMap"));
                            HashMap optMap = (HashMap)(((LinkedHashMap)products.get(i)).get("productOptMap"));
                            InsiderProduct product = createProduct(mustMap, optMap);
                            ips[i] = product;
                        }

                        Insider.Instance.visitCartPage(ips);
                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals(InsiderHybridMethods.SET_GENDER)) {
                if (args.get(0) == null)
                    return false;

                InsiderHybrid.setGender((args.getInt(0)));
            } else if (action.equals(InsiderHybridMethods.SET_BIRTHDAY)) {
                if (args.get(0) == null)
                    return false;

                InsiderHybrid.setBirthday(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_NAME)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setName(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_SURNAME)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setSurname(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_AGE)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setAge(args.getInt(0));
            } else if (action.equals(InsiderHybridMethods.SET_SMS_OPTIN)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setSMSOptin(args.getBoolean(0));
            } else if (action.equals(InsiderHybridMethods.SET_EMAIL_OPTIN)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setEmailOptin(args.getBoolean(0));
            } else if (action.equals(InsiderHybridMethods.SET_PUSH_OPTIN)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setPushOptin(args.getBoolean(0));
            } else if (action.equals(InsiderHybridMethods.SET_LOCATION_OPTIN)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setLocationOptin(args.getBoolean(0));
            } else if (action.equals(InsiderHybridMethods.SET_WHATSAPP_OPTIN)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setWhatsappOptin(args.getBoolean(0));
            } else if (action.equals(InsiderHybridMethods.SET_LANGUAGE)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setLanguage(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_LOCALE)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setLocale(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_FACEBOOK_ID)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setFacebookID(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_TWITTER_ID)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setTwitterID(args.getString(0));
            } else if (action.equals(InsiderHybridMethods.SET_CUSTOM_ATTRIBUTE_WITH_STRING)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;

                Insider.Instance.getCurrentUser().setCustomAttributeWithString(args.getString(0), args.getString(1));
            } else if (action.equals(InsiderHybridMethods.SET_CUSTOM_ATTRIBUTE_WITH_DOUBLE)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;

                Insider.Instance.getCurrentUser().setCustomAttributeWithDouble(args.getString(0), args.getDouble(1));
            } else if (action.equals(InsiderHybridMethods.SET_CUSTOM_ATTRIBUTE_WITH_INT)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;

                Insider.Instance.getCurrentUser().setCustomAttributeWithInt(args.getString(0), args.getInt(1));
            } else if (action.equals(InsiderHybridMethods.SET_CUSTOM_ATTRIBUTE_WITH_BOOLEAN)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;

                Insider.Instance.getCurrentUser().setCustomAttributeWithBoolean(args.getString(0), args.getBoolean(1));
            } else if (action.equals(InsiderHybridMethods.SET_CUSTOM_ATTRIBUTE_WITH_DATE)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;
                InsiderHybrid.setCustomAttributeWithDate(args.getString(0), args.getString(1));
            } else if (action.equals(InsiderHybridMethods.SET_CUSTOM_ATTRIBUTE_WITH_ARRAY)) {
                if (args.get(0) == null || args.get(1) == null)
                    return false;

                ArrayList<String> arrayList = CDVUtils.convertJSONToArrayList(args.getString(1));

                Insider.Instance.getCurrentUser().setCustomAttributeWithArray(args.getString(0), arrayList.toArray(new String[arrayList.size()]));
            } else if (action.equals(InsiderHybridMethods.UNSET_CUSTOM_ATTRIBUTE)) {
                if (args.get(0) == null)
                    return false;
                Insider.Instance.getCurrentUser().unsetCustomAttribute(args.getString(0));

            } else if (action.equals(InsiderHybridMethods.LOGIN)) {
                if (args.get(0) == null) {
                    return false;
                }

                Map<String, Object> identifiers = CDVUtils.convertJSONToMap(args.getString(0));

                InsiderIdentifiers insiderIdentifiers = new InsiderIdentifiers();

                for (String key : identifiers.keySet()) {
                    switch (key) {
                        case InsiderHybridMethods.ADD_EMAIL:
                            insiderIdentifiers.addEmail(String.valueOf(identifiers.get(key)));
                            break;
                        case InsiderHybridMethods.ADD_PHONE_NUMBER:
                            insiderIdentifiers.addPhoneNumber(String.valueOf(identifiers.get(key)));
                            break;
                        case InsiderHybridMethods.ADD_USER_ID:
                            insiderIdentifiers.addUserID(String.valueOf(identifiers.get(key)));
                            break;
                        default:
                            insiderIdentifiers.addCustomIdentifier(key, String.valueOf(identifiers.get(key)));
                            break;
                    }
                }

                if (args.length() > 1) {
                    Insider.Instance.getCurrentUser().login(insiderIdentifiers, new InsiderUser.InsiderIDResult() {
                        @Override
                        public void insiderIDResult(String insiderID) {

                            if (insiderID != null) {
                                callbackSuccess(callbackContext, insiderID);
                                return;
                            }
                        }
                    });
                }

                Insider.Instance.getCurrentUser().login(insiderIdentifiers);
            } else if (action.equals(InsiderHybridMethods.LOGOUT)) {
                Insider.Instance.getCurrentUser().logout();
            } else if (action.equals(Constants.HANDLE_NOTIFICATION)) {
                if (args.get(0) == null)
                    return false;

                Map<String, String> remoteMessageStringMap = new HashMap<>();
                remoteMessageStringMap = CDVUtils.convertJSONToStringMap(args.getString(0));

                for (String key : remoteMessageStringMap.keySet()) {
                    remoteMessageStringMap.put(key, String.valueOf(CDVUtils.convertJSONToStringMap(args.getString(0)).get(key)));
                }

                String provider = Insider.Instance.getCurrentProvider(cordova.getContext());

                switch (provider) {
                    case "huawei":
                        com.huawei.hms.push.RemoteMessage hmsRemoteMessage = new com.huawei.hms.push.RemoteMessage.Builder("insider").setData(remoteMessageStringMap).build();
                        Insider.Instance.handleHMSNotification(cordova.getContext(), hmsRemoteMessage);
                        break;
                    case "other":
                    case "google":
                        RemoteMessage fcmRemoteMessage = new RemoteMessage.Builder("insider").setData(remoteMessageStringMap).build();
                        Insider.Instance.handleFCMNotification(cordova.getContext(), fcmRemoteMessage);
                        break;
                    default:
                        break;
                }
            } else if (action.equals("enableCarrierCollection")) {
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.enableCarrierCollection(args.getBoolean(0));
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        } catch (JSONException e) {
                            Insider.Instance.putException(e);
                        }
                    }
                });
            } else if (action.equals("enableLocationCollection")) {
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.enableLocationCollection(args.getBoolean(0));
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        } catch (JSONException e) {
                            Insider.Instance.putException(e);
                        }
                    }
                });
            } else if (action.equals("enableIpCollection")) {
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.enableIpCollection(args.getBoolean(0));
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        } catch (JSONException e) {
                            Insider.Instance.putException(e);
                        }
                    }
                });
            } else if (action.equals("getPluginInfo")) {
                try {
                    PackageManager packageManager = this.cordova.getActivity().getPackageManager();

                    JSONObject r = new JSONObject();

                    r.put("version", packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0).versionName);
                    r.put("build", packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0).versionCode);

                    callbackSuccess(callbackContext, r);
                } catch (PackageManager.NameNotFoundException e) {
                    callbackContext.error("Exception thrown");
                }

                return true;
            } else if (action.equals("putErrorLog")) {
                if (args.get(0) == null)
                    return false;

                Exception exceptionObject = new Exception(args.getString(0));

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Insider.Instance.putException(exceptionObject);
                    }
                });

            } else if (action.equals(InsiderHybridMethods.REGISTER_WITH_QUIET_PERMISSION)) {
                return true;
            } else if (action.equals("signUpConfirmation")) {
                Insider.Instance.signUpConfirmation();
            } else if (action.equals("setPushToken")) {
                Insider.Instance.setPushToken(args.getString(0));
            } else {
                return false;
            }

            return true;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return false;
    }


    private static ContentOptimizerDataType getDataType(String dataType) {
        if (dataType.equals("Content")) {
            return ContentOptimizerDataType.CONTENT;
        } else {
            return ContentOptimizerDataType.ELEMENT;
        }
    }

    private static void callbackSuccess(CallbackContext callbackContext, String callbackValue) {
        try {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, callbackValue);

            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static void callbackSuccess(CallbackContext callbackContext, JSONObject callbackValue) {
        try {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, callbackValue);

            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static void callbackSuccess(CallbackContext callbackContext, int callbackValue) {
        try {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, callbackValue);

            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static void callbackSuccess(CallbackContext callbackContext, boolean callbackValue) {
        try {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, callbackValue);

            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static void callbackFailure(CallbackContext callbackContext, String callbackValue) {
        try {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, callbackValue);

            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static boolean isProductValid(Map<String, Object> productMustMap) {
        return productMustMap.containsKey(Constants.PRODUCT_ID)
                && productMustMap.containsKey(Constants.NAME)
                && productMustMap.containsKey(Constants.TAXONOMY)
                && productMustMap.containsKey(Constants.IMAGE_URL)
                && productMustMap.containsKey(Constants.UNIT_PRICE)
                && productMustMap.containsKey(Constants.CURRENCY);
    }

    public static InsiderProduct createProduct(Map<String, Object> productMustMap, Map<String, Object> productOptMap) {
        try {
            if (!isProductValid(productMustMap)) return null;

            String[] taxonomy;

            Object taxObject = productMustMap.get(Constants.TAXONOMY);

            if (taxObject.getClass().isArray()) {
                taxonomy = (String[]) taxObject;
            } else {
                taxonomy = ((ArrayList<String>) taxObject).toArray(new String[0]);
            }

            double price=0;
            if(productMustMap.get(Constants.UNIT_PRICE) instanceof Integer ){
                price = Integer.valueOf((Integer) productMustMap.get(Constants.UNIT_PRICE)).doubleValue();
            }
            else{
                price = (double) productMustMap.get(Constants.UNIT_PRICE);
            }

            InsiderProduct product = Insider.Instance.createNewProduct(
                    (String) productMustMap.get(Constants.PRODUCT_ID),
                    (String) productMustMap.get(Constants.NAME),
                    taxonomy,
                    (String) productMustMap.get(Constants.IMAGE_URL),
                    price,
                    (String) productMustMap.get(Constants.CURRENCY)
            );

            if (productOptMap == null || productOptMap.size() == 0) return product;

            Map<String, Object> validatedMap = InsiderHybridUtils.validateMap(productOptMap);

            for (Map.Entry<String, Object> entry : validatedMap.entrySet()) {
                Object value = entry.getValue();
                switch (entry.getKey()) {
                    case Constants.SALE_PRICE:
                        product.setSalePrice((double) value);
                        break;
                    case Constants.STOCK:
                        product.setStock(((int) value));
                        break;
                    case Constants.COLOR:
                        product.setColor((String) value);
                        break;
                    case Constants.SIZE:
                        product.setSize((String) value);
                        break;
                    case Constants.QUANTITY:
                        product.setQuantity(((int) value));
                        break;
                    case Constants.SHIPPING_COST:
                        product.setShippingCost((double) value);
                        break;
                    case Constants.VOUCHER_NAME:
                        product.setVoucherName((String) value);
                        break;
                    case Constants.VOUCHER_DISCOUNT:
                        product.setVoucherDiscount((double) value);
                        break;
                    case Constants.PROMOTION_NAME:
                        product.setPromotionName((String) value);
                        break;
                    case Constants.PROMOTION_DISCOUNT:
                        product.setPromotionDiscount((double) value);
                        break;
                    case Constants.GROUP_CODE:
                        product.setGroupCode((String) value);
                        break;
                    default:
                        setProductCustomAttribute(product, entry.getKey(), value);
                        break;
                }
            }
            return product;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
        return null;
    }

    private static void setProductCustomAttribute(InsiderProduct product, String key, Object value) {
        try {
            if (key == null || key.length() == 0 || value == null) return;
            switch (value.getClass().getSimpleName()) {
                case "String":
                    product.setCustomAttributeWithString(key, (String) value);
                    break;
                case "Double":
                    product.setCustomAttributeWithDouble(key, (double) value);
                    break;
                case "Integer":
                    product.setCustomAttributeWithInt(key, (int) value);
                    break;
                case "Boolean":
                    product.setCustomAttributeWithBoolean(key, (boolean) value);
                    break;
                case "Date":
                    product.setCustomAttributeWithDate(key, (Date) value);
                    break;
                case "String[]":
                    product.setCustomAttributeWithArray(key, (String[]) value);
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }
}