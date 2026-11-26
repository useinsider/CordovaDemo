package com.useinsider.cordovademo;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.RemoteMessage;
import com.useinsider.insider.Insider;

import by.chemerisuk.cordova.firebase.FirebaseMessagingPluginService;

// Insider pushes go to the SDK natively: the Firebase plugin reaches JS only while the WebView
// is alive, so a push to a closed app would be lost. Other pushes keep the plugin's behaviour.
public class InsiderAwareMessagingService extends FirebaseMessagingPluginService {

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        if ("Insider".equals(remoteMessage.getData().get("source"))) {
            Insider.Instance.handleFCMNotification(getApplicationContext(), remoteMessage);
            return;
        }
        super.onMessageReceived(remoteMessage);
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Insider.Instance.setPushToken(token);
    }

    @Override
    public void onRegistered(@NonNull String token) {
        super.onRegistered(token);
        Insider.Instance.setPushToken(token);
    }
}
