package com.useinsider.cordova;

import static com.useinsider.insider.InsiderCallbackType.INAPP_BUTTON_CLICK;
import static com.useinsider.insider.InsiderCallbackType.NOTIFICATION_OPEN;
import static com.useinsider.insider.InsiderCallbackType.TEMP_STORE_ADDED_TO_CART;
import static com.useinsider.insider.InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION;
import static com.useinsider.insider.InsiderCallbackType.TEMP_STORE_PURCHASE;

import android.app.Application;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
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
import com.useinsider.insider.InsiderEventListener;
import com.useinsider.insider.InsiderAppCardButton;
import com.useinsider.insider.InsiderAppCard;

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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.RejectedExecutionException;

public class InsiderPlugin extends CordovaPlugin {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    private boolean isCoreInitialized = false;

    private InsiderIDListener insiderIDListener;

    /**
     * Written on the Cordova thread by addEventObserver / removeEventObserver and also read and
     * cleared from the registration worker thread by failEventObserverRegistration, so the write
     * has to be published across threads like the two fields below.
     */
    private volatile InsiderEventListener insiderEventListener;

    /**
     * Written on the Cordova thread by addEventObserver / removeEventObserver and read on the
     * SDK's listener thread by sendEventToJS. volatile publishes the write so the delivery
     * thread cannot keep observing a stale (already removed) CallbackContext indefinitely.
     */
    private volatile CallbackContext eventObserverCallbackContext;

    /**
     * Single-threaded executor that serialises event delivery to JS.
     *
     * The SDK invokes onEventRecorded on its own internal thread and results must not be sent
     * from there. cordova.getThreadPool() is a POOL - concurrent workers would let two events
     * race and arrive at JS out of order, which corrupts funnels (a product_detail_page_view
     * landing after the purchase it preceded). A single worker thread gives strict FIFO while
     * keeping this analytics mirror off the UI thread, which runOnUiThread would burden with
     * every recorded event.
     *
     * volatile for the same reason as eventObserverCallbackContext above: it is written on the
     * Cordova thread by addEventObserver / removeEventObserver and read on the SDK's listener
     * thread by sendEventToJS, so the write must be published to that thread.
     */
    private volatile ExecutorService eventDeliveryExecutor;

    /**
     * Single-threaded executor that serialises the SDK addObserver / removeObserver calls.
     *
     * Separate from eventDeliveryExecutor, which is shut down on unregister — this one must
     * outlive a full unsubscribe so a later re-subscribe still orders against the removal
     * that preceded it.
     *
     * cordova.getThreadPool() cannot be used here: it is concurrent, so a rapid
     * remove-then-add can invert and run the add first. The SDK would then be left holding
     * an observer that JS has already dropped, firing onEventRecorded for the rest of the
     * process with nothing to deliver to and no later removeObserver to clear it. The iOS
     * side avoids the same inversion with its serial eventQueue.
     */
    private static final ExecutorService OBSERVER_REGISTRATION_EXECUTOR =
            Executors.newSingleThreadExecutor();

    /**
     * The plugin instance whose WebView receives SDK callbacks. The SDK outlives an Activity
     * recreation, so its callback must follow the newest live WebView rather than capture one.
     */
    private static InsiderPlugin callbackTarget;

    /** Callbacks fired while no live WebView had called init yet; flushed by the next init. */
    private static final List<String> pendingCallbacks = new ArrayList<>();

    /** Oldest held callbacks are dropped beyond this so a long-dead WebView cannot replay a backlog. */
    private static final int MAX_PENDING_CALLBACKS = 10;

    @Override
    protected void pluginInitialize() {
        super.initialize(cordova, webView);
    }

    public void init(final String partnerName, final String sdkVersion, final String appIdentifier) {
        try {
            attachCallbackTarget();

            if (Insider.Instance.isSDKInitialized())
                return;

            cordova.getActivity().runOnUiThread(new Runnable()  {
                @Override
                public void run() {
                    registerInsiderCallback();
                    
                    if (appIdentifier != null)
                        Insider.Instance.init(cordova.getActivity().getApplication(), partnerName, appIdentifier);
                    else
                        Insider.Instance.init(cordova.getActivity().getApplication(), partnerName);

                    Insider.Instance.setSDKType("cordova");
                    Insider.Instance.setHybridSDKVersion(sdkVersion);
                    Insider.Instance.resumeSessionHybridConfig(cordova.getActivity());

                    if (isCoreInitialized) {
                        Insider.Instance.resumeSessionHybridRequestConfig();
                    }

                    isCoreInitialized = true;

                    Insider.Instance.storePartnerName(partnerName);

                    reattachEventObserver();
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static void registerInsiderCallback() {
        try {
            Insider.Instance.registerInsiderCallback(new InsiderCallback() {
                @Override
                public void doAction(JSONObject jsonObject, InsiderCallbackType insiderCallbackType) {
                    try {
                        dispatchCallback("{'action':'" + insiderCallbackType + "','result':" + jsonObject.toString() + "}");
                    } catch (Exception e) {
                        Insider.Instance.putException(e);
                    }
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    private static void dispatchCallback(String json) {
        InsiderPlugin target;

        synchronized (pendingCallbacks) {
            target = callbackTarget;

            if (target == null) {
                holdCallback(json);

                return;
            }
        }

        target.deliverCallback(json);
    }

    private static void holdCallback(String json) {
        pendingCallbacks.add(json);

        while (pendingCallbacks.size() > MAX_PENDING_CALLBACKS) {
            pendingCallbacks.remove(0);
        }
    }

    // The target can be detached between dispatch and the UI-thread run; hold the callback then.
    private void deliverCallback(final String json) {
        try {
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    InsiderPlugin current;

                    synchronized (pendingCallbacks) {
                        current = callbackTarget;

                        if (current == null) {
                            holdCallback(json);

                            return;
                        }
                    }

                    if (current != InsiderPlugin.this) {
                        current.deliverCallback(json);

                        return;
                    }

                    loadHandleUrl(json);
                }
            });
        } catch (Exception e) {
            synchronized (pendingCallbacks) {
                holdCallback(json);
            }
        }
    }

    /**
     * Called from init, after JS has added its ins_notification_handle listener, so callbacks
     * held while the Activity was being recreated are delivered to the new WebView.
     */
    private void attachCallbackTarget() {
        List<String> callbacksToFlush;

        synchronized (pendingCallbacks) {
            callbackTarget = this;
            callbacksToFlush = new ArrayList<>(pendingCallbacks);
            pendingCallbacks.clear();
        }

        for (String json : callbacksToFlush) {
            loadHandleUrl(json);
        }
    }

    private void detachCallbackTarget() {
        synchronized (pendingCallbacks) {
            if (callbackTarget == this) {
                callbackTarget = null;
            }
        }
    }

    private static String resolveAppIdentifier(JSONArray args, int index) {
        Object appIdentifier = args.opt(index);

        return appIdentifier instanceof String && !((String) appIdentifier).isEmpty() ? (String) appIdentifier : null;
    }

    public void loadHandleUrl(final String json) {
        try {
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        webView.loadUrl("javascript:cordova.fireDocumentEvent('ins_notification_handle'," + json + ");");
                    } catch (Exception e) {
                        Insider.Instance.putException(e);
                    }
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
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

    /**
     * Registers a single InsiderEventListener and streams every recorded event back to JS
     * over the supplied CallbackContext.
     *
     * The listener is guarded by a null check so repeated addEventObserver calls never stack
     * native observers. Insider.Instance.events() is resolved fresh here (never cached in a
     * field) because it returns a no-op instance before the SDK finishes initializing.
     */
    private void addEventObserver(final CallbackContext callbackContext) {
        try {
            eventObserverCallbackContext = callbackContext;

            if (insiderEventListener != null) {
                return;
            }

            eventDeliveryExecutor = Executors.newSingleThreadExecutor();

            insiderEventListener = new InsiderEventListener() {
                @Override
                public void onEventRecorded(String name, Map<String, Object> parameters, long timestamp) {
                    sendEventToJS(name, parameters, timestamp);
                }
            };

            final InsiderEventListener listenerToRegister = insiderEventListener;

            OBSERVER_REGISTRATION_EXECUTOR.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Insider.Instance.events().addObserver(listenerToRegister);
                    } catch (Exception e) {
                        Insider.Instance.putException(e);

                        failEventObserverRegistration(callbackContext, listenerToRegister, e);
                    }
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);

            failEventObserverRegistration(callbackContext, insiderEventListener, e);
        }
    }

    /**
     * Re-registers the current listener once the SDK may have become usable.
     *
     * Insider.Instance.events() hands out a no-op instance while the SDK is uninitialised, frozen
     * or without consent, and that instance drops addObserver without an error, so an observer
     * added before init or consent would otherwise never receive an event. Re-adding is safe:
     * the SDK keeps a single registration for the same listener.
     */
    private void reattachEventObserver() {
        try {
            final InsiderEventListener listenerToReattach = insiderEventListener;

            if (listenerToReattach == null) {
                return;
            }

            OBSERVER_REGISTRATION_EXECUTOR.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        // A remove may have been queued since the read above; never revive it.
                        if (insiderEventListener != listenerToReattach) {
                            return;
                        }

                        Insider.Instance.events().addObserver(listenerToReattach);
                    } catch (Exception e) {
                        Insider.Instance.putException(e);
                    }
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    /**
     * Reports a failed native observer registration to JS AND tears the half-built registration
     * back down.
     *
     * Both halves matter. Without the error result, JS never learns the stream is dead: its
     * retry state machine only clears isNativeObserverRegistered in its onError handler, so a
     * failed registration would leave JS pointed at a stream that can never deliver, and the
     * retry path would be unreachable. Without the local teardown, the listener field would stay
     * non-null and the retried addEventObserver would take the "already registered" early return
     * and never actually call addObserver again.
     *
     * The error result deliberately does NOT set keepCallback. Cordova drops the callback entry
     * on a non-keepCallback result, which is exactly right here: the JS retry issues a fresh
     * cordova.exec with a NEW callbackId, so keeping the dead one alive would only leak it. A
     * later successful registration is unaffected because it is a different callbackId end to
     * end.
     */
    private void failEventObserverRegistration(final CallbackContext callbackContext, final InsiderEventListener failedListener, final Exception cause) {
        try {
            // Only tear down if this failure belongs to the CURRENT registration. A remove
            // followed by a fresh add could otherwise let a late failure from the old attempt
            // wipe out a newer, healthy observer.
            if (insiderEventListener == failedListener) {
                final ExecutorService executorToShutdown = eventDeliveryExecutor;

                insiderEventListener = null;
                eventObserverCallbackContext = null;
                eventDeliveryExecutor = null;

                if (executorToShutdown != null) {
                    executorToShutdown.shutdown();
                }
            }

            if (callbackContext != null) {
                callbackContext.error("[InsiderCordova] addEventObserver failed: " + cause);
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    /**
     * Removes the native observer and releases the stored CallbackContext.
     *
     * Android holds listeners strongly, so failing to call removeObserver would leak the
     * plugin (and the WebView) for the lifetime of the SDK.
     */
    private void removeEventObserver() {
        try {
            final InsiderEventListener listenerToRemove = insiderEventListener;
            final ExecutorService executorToShutdown = eventDeliveryExecutor;

            insiderEventListener = null;
            eventObserverCallbackContext = null;
            eventDeliveryExecutor = null;

            // Ordered shutdown: already-queued deliveries still run, no new ones are accepted.
            if (executorToShutdown != null) {
                executorToShutdown.shutdown();
            }

            if (listenerToRemove == null) {
                return;
            }

            OBSERVER_REGISTRATION_EXECUTOR.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Insider.Instance.events().removeObserver(listenerToRemove);
                    } catch (Exception e) {
                        Insider.Instance.putException(e);
                    }
                }
            });
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    /**
     * Listener-scoped result sender.
     *
     * The SDK delivers events on its own internal thread and results must NOT be sent from
     * there, so the payload is built on that thread (the parameters Map is only guaranteed to
     * be valid for the duration of the callback) and the send is handed to the plugin's own
     * single-thread executor.
     *
     * WHY A SINGLE-THREAD EXECUTOR AND NOT cordova.getThreadPool(): the thread pool runs tasks
     * concurrently, so two events recorded back to back could be sent in either order. Event
     * order is the whole point of this feature - a product_detail_page_view delivered after the
     * purchase it preceded produces a garbage funnel. One worker thread guarantees FIFO. The UI
     * thread would also preserve order but would put every recorded event on the main thread,
     * which this analytics mirror does not need (sendPluginResult is thread-safe and has no UI
     * thread requirement).
     */
    private void sendEventToJS(String name, Map<String, Object> parameters, long timestamp) {
        try {
            final CallbackContext callbackContext = eventObserverCallbackContext;
            final ExecutorService executor = eventDeliveryExecutor;

            if (callbackContext == null || executor == null || name == null) {
                return;
            }

            final JSONObject event = new JSONObject();

            event.put("name", name);
            event.put("parameters", CDVUtils.convertMapToJSON(parameters));
            // Whole seconds since 1970, passed through unchanged for parity with the native SDKs.
            event.put("timestamp", timestamp);

            try {
                executor.execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, event);

                            pluginResult.setKeepCallback(true);

                            callbackContext.sendPluginResult(pluginResult);
                        } catch (Exception e) {
                            Insider.Instance.putException(e);
                        }
                    }
                });
            } catch (RejectedExecutionException e) {
                // The observer was removed between the null check and the submit; the event is
                // intentionally dropped because JS is no longer listening.
            }
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }

    @Override
    public void onDestroy() {
        detachCallbackTarget();
        removeEventObserver();

        super.onDestroy();
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (args == null) {
            return false;
        }

        try {
            if (action.equals("init")) {
                init(args.getString(0), args.getString(1), resolveAppIdentifier(args, 4));
            } else if (action.equals("initWithCustomEndpoint")) {
                Insider.Instance.setCustomEndpoint(args.getString(3));

                init(args.getString(0), args.getString(1), resolveAppIdentifier(args, 4));
            } else if (action.equals("reinitWithPartnerName")) {
                Insider.Instance.reinitWithPartnerName(args.getString(0));
            } else if (action.equals("setGDPRConsent")) {
                boolean gdprConsent = Boolean.parseBoolean(args.getString(0));

                Insider.Instance.setGDPRConsent(gdprConsent);

                if (gdprConsent) {
                    reattachEventObserver();
                }
            } else if (action.equals("setMobileAppAccess")) {
                boolean mobileAppAccess = Boolean.parseBoolean(args.getString(0));

                Insider.Instance.setMobileAppAccess(mobileAppAccess);

                if (mobileAppAccess) {
                    reattachEventObserver();
                }
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
            } else if (action.equals("markContentOptimizerAsSeen")) {
                Insider.Instance.markContentOptimizerAsSeen(args.getString(0));
            } else if (action.equals("removeInapp")) {
                Insider.Instance.removeInapp(this.cordova.getActivity());
            } else if (action.equals(InsiderHybridMethods.ITEM_PURCHASED)) {
                if (args.get(0) == null || args.getString(1) == null || args.getString(2) == null || args.get(3) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(1));
                            Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(2));
                            JSONArray customParameters = args.getJSONArray(3);
                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(4));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.itemPurchased(String.valueOf(args.get(0)), product, mappedCustomParameters);
                            } else {
                                Insider.Instance.itemPurchased(String.valueOf(args.get(0)), product);
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.ITEM_ADDED_TO_CART)) {
                if (args.get(0) == null || args.getString(1) == null || args.get(2) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                            JSONArray customParameters = args.getJSONArray(2);
                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(3));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.itemAddedToCart(product, mappedCustomParameters);
                            } else {
                                Insider.Instance.itemAddedToCart(product);
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
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
                            String productID = args.getString(0);
                            String saleID = args.length() > 1 && !args.isNull(1) ? args.getString(1) : null;
                            JSONArray customParams = args.length() > 2 && !args.isNull(2) ? args.getJSONArray(2) : null;
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(customParams);

                            if (saleID != null && !saleID.isEmpty()) {
                                Insider.Instance.itemRemovedFromCart(productID, saleID, mappedCustomParameters);
                            } else if (!mappedCustomParameters.isEmpty()) {
                                Insider.Instance.itemRemovedFromCart(productID, mappedCustomParameters);
                            } else {
                                Insider.Instance.itemRemovedFromCart(productID);
                            }
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.CART_CLEARED)) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(0));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.cartCleared(mappedCustomParameters);
                            } else {
                                Insider.Instance.cartCleared();
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
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
            } else if (action.equals("getMessageCenterDataWithIdentifiers")) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null || args.get(3) == null)
                    return false;

                cordova.getThreadPool().execute(() -> {
                    try {
                        int limit = args.getInt(0);
                        long startDateEpoch = Long.parseLong(args.getString(1));
                        long endDateEpoch = Long.parseLong(args.getString(2));

                        InsiderIdentifiers insiderIdentifiers = buildInsiderIdentifiers(CDVUtils.convertJSONToMap(args.getString(3)));

                        Insider.Instance.getMessageCenterData(
                                limit,
                                new Date(startDateEpoch),
                                new Date(endDateEpoch),
                                insiderIdentifiers,
                                new MessageCenterData() {
                                    @Override
                                    public void loadMessageCenterData(JSONArray jsonArray) {
                                        callbackSuccess(callbackContext, jsonArray.toString());
                                    }
                                });
                    } catch (JSONException e) {
                        callbackFailure(callbackContext, e.toString());
                    }
                });
            } else if (action.equals("getAppCardsCampaigns")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        Insider.Instance.appCards().getCampaigns((responseObject, error) -> {
                            if (error != null || responseObject == null) {
                                callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(error != null ? error : new Exception("Unknown error.")));
                            } else {
                                JSONObject jsonObject = responseObject.toJSONObject();
                                callbackSuccess(callbackContext, jsonObject);
                            }
                        });
                    } catch (Exception e) {
                        callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(e));
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals("markAppCardAsRead")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        if (args.get(0) == null) {
                            callbackFailure(callbackContext, "appCardIds argument is required");
                            return;
                        }

                        String[] appCardIds = (CDVUtils.convertJSONToArrayList(args.get(0).toString())).toArray(new String[0]);

                        Insider.Instance.appCards().markAsRead(appCardIds, error -> {
                            if (error != null) {
                                callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(error));
                            } else {
                                callbackSuccess(callbackContext, "SUCCESS");
                            }
                        });
                    } catch (Exception e) {
                        callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(e));
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals("markAppCardAsUnread")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        if (args.get(0) == null) {
                            callbackFailure(callbackContext, "appCardIds argument is required");
                            return;
                        }

                        String[] appCardIds = (CDVUtils.convertJSONToArrayList(args.get(0).toString())).toArray(new String[0]);

                        Insider.Instance.appCards().markAsUnread(appCardIds, error -> {
                            if (error != null) {
                                callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(error));
                            } else {
                                callbackSuccess(callbackContext, "SUCCESS");
                            }
                        });
                    } catch (Exception e) {
                        callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(e));
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals("viewAppCard")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        if (args.get(0) == null) {
                            callbackFailure(callbackContext, "app card data argument is required");
                            return;
                        }

                        new InsiderAppCard(
                            new JSONObject(args.getString(0))
                        ).view();
                        callbackSuccess(callbackContext, "SUCCESS");
                    } catch (JSONException e) {
                        callbackFailure(callbackContext, "Invalid app card data JSON: " + e.getMessage());
                        Insider.Instance.putException(e);
                    } catch (Exception e) {
                        callbackFailure(callbackContext, "Exception: " + e.toString());
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals("clickAppCard")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        if (args.get(0) == null) {
                            callbackFailure(callbackContext, "app card data argument is required");
                            return;
                        }

                        new InsiderAppCard(
                            new JSONObject(args.getString(0))
                        ).click();
                        callbackSuccess(callbackContext, "SUCCESS");
                    } catch (JSONException e) {
                        callbackFailure(callbackContext, "Invalid app card data JSON: " + e.getMessage());
                        Insider.Instance.putException(e);
                    } catch (Exception e) {
                        callbackFailure(callbackContext, "Exception: " + e.toString());
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals("clickAppCardButton")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        if (args.get(0) == null || args.get(1) == null) {
                            callbackFailure(callbackContext, "appCardId and button data arguments are required");
                            return;
                        }

                        new InsiderAppCardButton(
                            args.getString(0),
                            new JSONObject(args.getString(1))
                        ).click();
                        callbackSuccess(callbackContext, "SUCCESS");
                    } catch (JSONException e) {
                        callbackFailure(callbackContext, "Invalid button data JSON: " + e.getMessage());
                        Insider.Instance.putException(e);
                    } catch (Exception e) {
                        callbackFailure(callbackContext, "Exception: " + e.toString());
                        Insider.Instance.putException(e);
                    }
                });
            } else if (action.equals("deleteAppCards")) {
                cordova.getThreadPool().execute(() -> {
                    try {
                        if (args.get(0) == null) {
                            callbackFailure(callbackContext, "appCardIds argument is required");
                            return;
                        }

                        String[] appCardIds = (CDVUtils.convertJSONToArrayList(args.get(0).toString())).toArray(new String[0]);

                        Insider.Instance.appCards().delete(appCardIds, error -> {
                            if (error != null) {
                                callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(error));
                            } else {
                                callbackSuccess(callbackContext, "SUCCESS");
                            }
                        });
                    } catch (Exception e) {
                        callbackFailure(callbackContext, CDVUtils.appCardsErrorToJSON(e));
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
                        try {
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(0));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.visitHomePage(mappedCustomParameters);
                            } else {
                                Insider.Instance.visitHomePage();
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.VISIT_LISTING_PAGE)) {
                if (args.get(0) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String[] taxonomy = (CDVUtils.convertJSONToArrayList(args.get(0).toString())).toArray(new String[0]);
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(1));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.visitListingPage(taxonomy, mappedCustomParameters);
                            } else {
                                Insider.Instance.visitListingPage(taxonomy);
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.VISIT_PRODUCT_DETAIL_PAGE)) {
                if (args.get(0) == null || args.get(1) == null || args.get(2) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                            JSONArray customParameters = args.getJSONArray(2);
                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(3));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.visitProductDetailPage(product, mappedCustomParameters);
                            } else {
                                Insider.Instance.visitProductDetailPage(product);
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals(InsiderHybridMethods.VISIT_CART_PAGE)) {
                if (args.get(0) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String json = args.getString(0);
                            ArrayList products = objectMapper.readValue(json, ArrayList.class);
                            InsiderProduct[] ips = new InsiderProduct[products.size()];

                            for (int i = 0; i < products.size(); i++) {
                                HashMap requiredFields = (HashMap)(((LinkedHashMap)products.get(i)).get("requiredFields"));
                                HashMap optionalFields = (HashMap)(((LinkedHashMap)products.get(i)).get("optionalFields"));
                                JSONArray customParameters = null;
                                Object customParamsObj = ((LinkedHashMap)products.get(i)).get("customParameters");
                                if (customParamsObj != null) {
                                    try {
                                        // Convert Object (Map/ArrayList/etc.) to JSON string using ObjectMapper, then parse to JSONArray
                                        String jsonString = objectMapper.writeValueAsString(customParamsObj);
                                        customParameters = new JSONArray(jsonString);
                                    } catch (Exception e) {
                                        Insider.Instance.putException(e);
                                    }
                                }
                                InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                                ips[i] = product;
                            }

                            String cartSaleID = args.length() > 1 && !args.isNull(1) ? args.getString(1) : null;
                            JSONArray cartCustomParams = args.length() > 2 && !args.isNull(2) ? args.getJSONArray(2) : null;
                            Map<String, Object> mappedCartCustomParameters = CDVUtils.parseCustomParameters(cartCustomParams);

                            if (cartSaleID != null && !cartSaleID.isEmpty()) {
                                Insider.Instance.visitCartPage(ips, cartSaleID, mappedCartCustomParameters);
                            } else if (!mappedCartCustomParameters.isEmpty()) {
                                Insider.Instance.visitCartPage(ips, mappedCartCustomParameters);
                            } else {
                                Insider.Instance.visitCartPage(ips);
                            }
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
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
            } else if (action.equals(Constants.SET_PROMOTIONAL_OPTIN)) {
                if (args.get(0) == null)
                    return false;

                Insider.Instance.getCurrentUser().setPromotionalOptin(args.getBoolean(0));
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
            } else if (action.equals(Constants.TRIGGER_PUSH_PROCESS_WITH_NOTIFICATION_DATA)) {
                if (args.getString(0) == null)
                    return false;

                Map<String, String> remoteMessageStringMap = CDVUtils.convertJSONToStringMap(args.getString(0));

                Insider.Instance.triggerPushProcessWithNotificationData(cordova.getContext(), remoteMessageStringMap);
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
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(0));
            
                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.signUpConfirmation(mappedCustomParameters);
                            } else {
                                Insider.Instance.signUpConfirmation();
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
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
            } else if (action.equals("addEventObserver")) {
                addEventObserver(callbackContext);
            } else if (action.equals("removeEventObserver")) {
                removeEventObserver();

                callbackSuccess(callbackContext, "SUCCESS");
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
            } else if (action.equals("showNativeAppReview")) {
                Insider.Instance.showNativeRating();
            } else if (action.equals("handleUniversalLink")) {
                if (args.get(0) == null)
                    return false;

                Intent universalLinkIntent = new Intent();
                Uri data = Uri.parse(args.getString(0));
                universalLinkIntent.setData(data);
                Insider.Instance.handleUniversalLink(universalLinkIntent);
            } else if (action.equals("itemAddedToWishlist")) {
                if (args.get(0) == null || args.getString(1) == null || args.get(2) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> requiredFields = CDVUtils.convertJSONToMap(args.getString(0));
                            Map<String, Object> optionalFields = CDVUtils.convertJSONToMap(args.getString(1));
                            JSONArray customParameters = args.getJSONArray(2);
                            InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(3));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.itemAddedToWishlist(product, mappedCustomParameters);
                            } else {
                                Insider.Instance.itemAddedToWishlist(product);
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
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
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(1));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.itemRemovedFromWishlist(args.getString(0), mappedCustomParameters);
                            } else {
                                Insider.Instance.itemRemovedFromWishlist(args.getString(0));
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals("wishlistCleared")) {
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(0));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.wishlistCleared(mappedCustomParameters);
                            } else {
                                Insider.Instance.wishlistCleared();
                            }

                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
                        }
                    }
                });
            } else if (action.equals("visitWishlistPage")) {
                if (args.get(0) == null)
                    return false;

                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            String json = args.getString(0);
                            ArrayList products = objectMapper.readValue(json, ArrayList.class);
                            InsiderProduct[] ips = new InsiderProduct[products.size()];

                            for (int i = 0; i < products.size(); i++) {
                                HashMap requiredFields = (HashMap)(((LinkedHashMap)products.get(i)).get("requiredFields"));
                                HashMap optionalFields = (HashMap)(((LinkedHashMap)products.get(i)).get("optionalFields"));
                                JSONArray customParameters = null;
                                Object customParamsObj = ((LinkedHashMap)products.get(i)).get("customParameters");

                                if (customParamsObj != null) {
                                    try {
                                        // Convert Object (Map/ArrayList/etc.) to JSON string using ObjectMapper, then parse to JSONArray
                                        String jsonString = objectMapper.writeValueAsString(customParamsObj);
                                        customParameters = new JSONArray(jsonString);
                                    } catch (Exception e) {
                                        Insider.Instance.putException(e);
                                    }
                                }
                                InsiderProduct product = CDVUtils.parseProduct(requiredFields, optionalFields, customParameters);
                                ips[i] = product;
                            }

                            Map<String, Object> mappedCustomParameters = CDVUtils.parseCustomParameters(args.getJSONArray(1));

                            if (mappedCustomParameters.size() > 0) {
                                Insider.Instance.visitWishlistPage(ips, mappedCustomParameters);
                            } else {
                                Insider.Instance.visitWishlistPage(ips);
                            }
                            callbackSuccess(callbackContext, "SUCCESS");
                        } catch (Exception exception) {
                            callbackFailure(callbackContext, exception.getMessage());
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

    private static void callbackFailure(CallbackContext callbackContext, JSONObject callbackValue) {
        try {
            PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, callbackValue);

            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);
        } catch (Exception e) {
            Insider.Instance.putException(e);
        }
    }



    private InsiderIdentifiers buildInsiderIdentifiers(Map<String, Object> identifiersMap) {
        InsiderIdentifiers insiderIdentifiers = new InsiderIdentifiers();
        for (String key : identifiersMap.keySet()) {
            switch (key) {
                case InsiderHybridMethods.ADD_EMAIL:
                    insiderIdentifiers.addEmail(String.valueOf(identifiersMap.get(key)));
                    break;
                case InsiderHybridMethods.ADD_PHONE_NUMBER:
                    insiderIdentifiers.addPhoneNumber(String.valueOf(identifiersMap.get(key)));
                    break;
                case InsiderHybridMethods.ADD_USER_ID:
                    insiderIdentifiers.addUserID(String.valueOf(identifiersMap.get(key)));
                    break;
                default:
                    insiderIdentifiers.addCustomIdentifier(key, String.valueOf(identifiersMap.get(key)));
                    break;
            }
        }
        return insiderIdentifiers;
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