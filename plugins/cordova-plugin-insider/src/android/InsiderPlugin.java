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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.RemoteMessage;
import com.huawei.hms.push.HmsMessageService;
import com.useinsider.insider.CloseButtonPosition;
import com.useinsider.insider.ContentOptimizerDataType;
import com.useinsider.insider.Insider;
import com.useinsider.insider.InsiderCallback;
import com.useinsider.insider.InsiderCallbackType;
import com.useinsider.insider.InsiderEvent;
import com.useinsider.insider.InsiderIdentifiers;
import com.useinsider.insider.InsiderProduct;
import com.useinsider.insider.InsiderUser;
import com.useinsider.insider.MessageCenterData;
import com.useinsider.insider.RecommendationEngine;
import com.useinsider.insiderhybrid.InsiderHybrid;
import com.useinsider.insiderhybrid.InsiderHybridUtils;
import com.useinsider.insiderhybrid.constants.InsiderHybridMethods;
import com.useinsider.insider.InsiderIDListener;

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

    private InsiderIDListener insiderIDListener;

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
                    
                    InsiderHybrid.initWithActivity(cordova.getActivity(), partnerName);

                    Insider.Instance.setSDKType("cordova");
                    Insider.Instance.setHybridSDKVersion(sdkVersion);
                    Insider.Instance.resumeSessionHybridConfig(cordova.getActivity());

                    if (isCoreInitialized) {
                        Insider.Instance.resumeSessionHybridRequestConfig();
                    }

                    isCoreInitialized = true;

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

    public void sendInsiderIDToJS(String insiderIDObject) {
        try {
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        webView.loadUrl("javascript:cordova.fireDocumentEvent('ins_insider_id_listener'," + insiderIDObject + ");");
                    } catch (Exception e) {
                        Insider.Instance.putException(e);
                    }
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
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
            } else if (action.equals("setMobileAppAccess")) {
                Insider.Instance.setMobileAppAccess(Boolean.parseBoolean(args.getString(0)));
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
            }  else if (action.equals("getContentStringWithoutCache")) {
                ContentOptimizerDataType stringVariableDataType = getDataType(args.getString(2));

                String optimizedString = Insider.Instance.getContentStringWithoutCache(args.getString(0), args.getString(1), stringVariableDataType);

                if (optimizedString != null && optimizedString.length() > 0) {
                    callbackSuccess(callbackContext, optimizedString);
                }
            } else if (action.equals("getContentIntWithoutCache")) {
                ContentOptimizerDataType intVariableDataType = getDataType(args.getString(2));

                int optimizedInteger = Insider.Instance.getContentIntWithoutCache(args.getString(0), args.getInt(1), intVariableDataType);

                callbackSuccess(callbackContext, optimizedInteger);
            } else if (action.equals("getContentBoolWithoutCache")) {
                ContentOptimizerDataType boolVariableDataType = getDataType(args.getString(2));

                boolean optimizedBoolean = Insider.Instance.getContentBoolWithoutCache(args.getString(0), args.getBoolean(1), boolVariableDataType);

                callbackSuccess(callbackContext, optimizedBoolean);
            } else if (action.equals("removeInapp")) {
                Insider.Instance.removeInapp(this.cordova.getActivity());
            } else if (action.equals(InsiderHybridMethods.ITEM_PURCHASED)) {
                if (args.get(0) == null || args.getString(1) == null || args.getString(2) == null || args.get(3) == null)
                    return false;
               cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Map<String, Object> requiredFields = null;
                        Map<String, Object> optionalFields = null;
                        JSONArray customParameters = null;
                        try {
                            requiredFields = CDVUtils.convertJSONToMap(args.getString(1));
                            optionalFields = CDVUtils.convertJSONToMap(args.getString(2));
                            customParameters = args.getJSONArray(3);

                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                
                            Insider.Instance.itemPurchased(String.valueOf(args.get(0)), product);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (JSONException e) {
                            callbackFailure(callbackContext, e.toString());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.ITEM_ADDED_TO_CART)) {
                if (args.get(0) == null || args.getString(1) == null || args.get(2) == null)
                    return false;

                Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                JSONArray customParameters = args.getJSONArray(2);

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Insider.Instance.itemAddedToCart(product);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception e) {
                            callbackFailure(callbackContext, e.toString());
                        }
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
                        int limit = args.getInt(0);
                        long startDateEpoch = Long.parseLong(args.getString(1));
                        long endDateEpoch = Long.parseLong(args.getString(2));

                        InsiderHybrid.getMessageCenterData(limit, startDateEpoch, endDateEpoch, new MessageCenterData() {
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
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null || args.get(3) == null || args.get(4) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                            JSONArray customParameters = args.getJSONArray(2);

                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Insider.Instance.getSmartRecommendationWithProduct(product,
                                    args.getInt(3),
                                    args.getString(4),
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
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null || args.get(3) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                            JSONArray customParameters = args.getJSONArray(2);
                            InsiderProduct recommendationLogProduct = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Insider.Instance.clickSmartRecommendationProduct(args.getInt(3),recommendationLogProduct);
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
                            String eventName = args.getString(0);
                            JSONArray parametersArray = args.getJSONArray(1);
                            
                            InsiderEvent event = CDVUtils.parseEvent(eventName, parametersArray);
                            if (event != null) {
                                event.build();
                            }
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
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null)
                    return false;

                Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                JSONArray customParameters = args.getJSONArray(2);

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            InsiderProduct recommendationProduct = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Insider.Instance.visitProductDetailPage(recommendationProduct);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception e) {
                            callbackFailure(callbackContext, e.toString());
                        }
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
                        try {
                            for (int i = 0; i < products.size(); i++) {
                                HashMap requiredFields = (HashMap)(((LinkedHashMap)products.get(i)).get("requiredFields"));
                                HashMap optionalFields = (HashMap)(((LinkedHashMap)products.get(i)).get("optionalFields"));
                                JSONArray customParameters = null;
                                Object customParamsObj = ((LinkedHashMap)products.get(i)).get("customParameters");
                                if (customParamsObj != null) {
                                    customParameters = new JSONArray(customParamsObj.toString());
                                }
                                InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                                ips[i] = product;
                            }

                            Insider.Instance.visitCartPage(ips);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception e) {
                            callbackFailure(callbackContext, e.toString());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.SET_GENDER)) {
                if (args.get(0) == null)
                    return false;

                InsiderHybrid.setGender((args.getInt(0)));
            } else if (action.equals(InsiderHybridMethods.SET_BIRTHDAY)) {
                if (args.get(0) == null)
                    return false;

                // value is epoch milliseconds as string
                String epochString = args.getString(0);
                long birthdayEpoch = Long.parseLong(epochString);
                Date birthdayDate = new Date(birthdayEpoch);
                Insider.Instance.getCurrentUser().setBirthday(birthdayDate);
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
                // value is epoch milliseconds as string
                String epochString = args.getString(1);
                long dateEpoch = Long.parseLong(epochString);
                Date dateValue = new Date(dateEpoch);
                
                Insider.Instance.getCurrentUser().setCustomAttributeWithDate(args.getString(0), dateValue);
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
            // TODO: Use InsiderHybridMethods.LOGOUT_RESETTING_INSIDER_ID constant when insiderhybrid is upgraded to version with this constant
            } else if (action.equals("logoutResettingInsiderID")) {
                InsiderIdentifiers[] identifiers = null;

                if (args.get(0) != null && !args.isNull(0)) {
                    identifiers = convertJSONArrayToInsiderIdentifiersArray(args.getJSONArray(0));
                }

                if (args.length() > 1) {
                    final CallbackContext finalCallbackContext = callbackContext;
                    Insider.Instance.getCurrentUser().logoutResettingInsiderID(identifiers, new InsiderUser.InsiderIDResult() {
                        @Override
                        public void insiderIDResult(String insiderID) {
                            if (insiderID != null) {
                                callbackSuccess(finalCallbackContext, insiderID);
                            } else {
                                callbackSuccess(finalCallbackContext, "");
                            }
                        }
                    });
                } else {
                    Insider.Instance.getCurrentUser().logoutResettingInsiderID(identifiers);
                }
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
            } else if (action.equals(Constants.SET_INTERNAL_BROWSER_CLOSE_BUTTON_POSITION)) {
                if (args.get(0) == null)
                    return false;

                try {
                    String position = args.getString(0);
                    CloseButtonPosition enumPosition = CloseButtonPosition.valueOf(position);
                    Insider.Instance.setInternalBrowserCloseButtonPosition(enumPosition);
                } catch (Exception e) {
                    Insider.Instance.putException(e);
                }
                return true;
            } else if (action.equals("setPushToken")) {
                Insider.Instance.setPushToken(args.getString(0));
            } else if (action.equals("setEmail")) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setEmail(args.getString(0));
            } else if (action.equals("setPhoneNumber")) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setPhoneNumber(args.getString(0));
            } else if (action.equals("getInsiderID")) {
                callbackSuccess(callbackContext, Insider.Instance.getInsiderID());
            } else if (action.equals("registerInsiderIDListener")) {
                if (insiderIDListener == null) {
                    insiderIDListener = new InsiderIDListener() {
                        @Override
                        public void onUpdated(String insiderID) {
                            String insiderIDJSONObject = "{ 'insiderID':'" + insiderID + "' }";

                            sendInsiderIDToJS(insiderIDJSONObject);
                        }
                    };


                    Insider.Instance.registerInsiderIDListener(insiderIDListener);
                }
            } else if (action.equals("disableInAppMessages")) {
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.disableInAppMessages();
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        } catch (Exception e) {
                            Insider.Instance.putException(e);
                        }
                    }
                });
            } else if (action.equals("enableInAppMessages")) {
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.enableInAppMessages();
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                        } catch (Exception e) {
                            Insider.Instance.putException(e);
                        }
                    }
                });
            } else if (action.equals("itemAddedToWishlist")) {
                if (args.get(0) == null || args.getString(1) == null || args.get(2) == null)
                    return false;

                Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                JSONArray customParameters = args.getJSONArray(2);

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Insider.Instance.itemAddedToWishlist(product);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception e) {
                            callbackFailure(callbackContext, e.toString());
                        }
                    }
                });
            } else if (action.equals("itemRemovedFromWishlist")) {
                if (args.get(0) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Insider.Instance.itemRemovedFromWishlist(args.getString(0));
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            } else if (action.equals("wishlistCleared")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Insider.Instance.wishlistCleared();
                        callbackSuccess(callbackContext, "SUCCESS");
                    }
                });
            } else if (action.equals("visitWishlistPage")) {
                if (args.get(0) == null)
                    return false;

                String json = args.getString(0);
                ArrayList products = new ObjectMapper().readValue(json, ArrayList.class);
                InsiderProduct[] ips = new InsiderProduct[products.size()];

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            for (int i = 0; i < products.size(); i++) {
                                HashMap requiredFields = (HashMap)(((LinkedHashMap)products.get(i)).get("requiredFields"));
                                HashMap optionalFields = (HashMap)(((LinkedHashMap)products.get(i)).get("optionalFields"));
                                JSONArray customParameters = null;
                                Object customParamsObj = ((LinkedHashMap)products.get(i)).get("customParameters");
                                if (customParamsObj != null) {
                                    customParameters = new JSONArray(customParamsObj.toString());
                                }
                                InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                                ips[i] = product;
                            }

                            Insider.Instance.visitWishlistPage(ips);
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception e) {
                            callbackFailure(callbackContext, e.toString());
                        }
                    }
                });
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


    private InsiderIdentifiers[] convertJSONArrayToInsiderIdentifiersArray(JSONArray identifiersArray) {
        try {
            if (identifiersArray == null || identifiersArray.length() == 0) {
                return null;
            }
    
            InsiderIdentifiers[] identifiers = new InsiderIdentifiers[identifiersArray.length()];
    
            for (int i = 0; i < identifiersArray.length(); i++) {
                JSONObject identifierMap = identifiersArray.getJSONObject(i);
                InsiderIdentifiers insiderIdentifiers = new InsiderIdentifiers();
    
                Map<String, Object> identifierData = CDVUtils.convertJSONToMap(identifierMap.toString());
                for (String key : identifierData.keySet()) {
                    switch (key) {
                        case InsiderHybridMethods.ADD_EMAIL:
                            insiderIdentifiers.addEmail(String.valueOf(identifierData.get(key)));
                            break;
                        case InsiderHybridMethods.ADD_PHONE_NUMBER:
                            insiderIdentifiers.addPhoneNumber(String.valueOf(identifierData.get(key)));
                            break;
                        case InsiderHybridMethods.ADD_USER_ID:
                            insiderIdentifiers.addUserID(String.valueOf(identifierData.get(key)));
                            break;
                        default:
                            insiderIdentifiers.addCustomIdentifier(key, String.valueOf(identifierData.get(key)));
                            break;
                    }
                }
                identifiers[i] = insiderIdentifiers;
            }
            
            return identifiers;
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }

        return null;
    }
}