# Insider Cordova SDK

[![npm version](https://img.shields.io/npm/v/cordova-plugin-insider.svg)](https://www.npmjs.com/package/cordova-plugin-insider)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Official Cordova plugin for the [Insider](https://insiderone.com/) marketing
and growth platform. Wraps the native Insider SDK on Android and iOS and
exposes its features — user identification, event tracking, product and
purchase events, push notifications, smart recommendations, content
optimizer, message center and App Cards — through a single global `Insider`
object.

## Installation

```bash
cordova plugin add cordova-plugin-insider
```

## Platform requirements

| Platform | Minimum |
|----------|---------|
| Cordova | `>=7.0.0` |
| cordova-android | `>=6.3.0` |
| cordova-ios | `>=4.3.0` |
| Android | `minSdk 24`, `compileSdk 36` |
| iOS | deployment target `12.2` |

On iOS the pods are pinned by the plugin (`InsiderMobile 16.2.1`,
`InsiderGeofence 1.3.0`, `InsiderHybrid 1.8.0`). InsiderMobile 16 needs iOS 12.2,
so set `<preference name="deployment-target" value="12.2" />` in your app's
`config.xml` (cordova-ios 6 and 7 default to 11.0 and `pod install` fails).
After adding the platform, run:

```bash
cd platforms/ios && pod install
```

On Android the plugin pulls in Firebase Messaging, Google Play Services
location and Huawei HMS push as transitive dependencies. The
`after_plugin_install` hook adds the Huawei AGConnect classpath and Maven
repository to your app's Gradle files, so no manual Gradle edit is required.

## Quick start

```javascript
document.addEventListener('deviceready', onDeviceReady, false);

function handleInsiderCallback(callback) {
    switch (callback.action) {
        case 'NOTIFICATION_OPEN':
            // Handle push tap.
            break;
        case 'INAPP_BUTTON_CLICK':
            // Handle in-app button tap.
            break;
    }
}

async function onDeviceReady() {
    await Insider.init(
        'YOUR_PARTNER_NAME',
        'group.com.example.app', // iOS App Group; pass any value on Android.
        handleInsiderCallback
    );

    // Identify the user.
    Insider.getCurrentUser()
        .setName('Ada')
        .setEmail('ada@example.com')
        .setEmailOptin(true);

    // Tag a custom event with typed parameters.
    Insider.tagEvent('add_to_favorites')
        .addParameterWithString('product_id', 'sku-123')
        .addParameterWithDouble('price', 29.99)
        .build();
}
```

### Multiple apps under one partner

If your partner account has several apps, pass the app identifier Insider gave
you as the optional last argument, after the callback:

```javascript
Insider.init('YOUR_PARTNER_NAME', 'group.com.example.app', handleInsiderCallback, 'my_app');

Insider.initWithCustomEndpoint('YOUR_PARTNER_NAME', 'group.com.example.app', 'https://your.endpoint', handleInsiderCallback, 'my_app');
```

- Format: `^[a-z0-9][a-z0-9_]{0,49}$`. The plugin forwards it unchanged and the
  native SDKs validate it; an invalid value is logged and ignored, and
  initialization still completes.
- Omitting it, or passing `null`, `''` or any non-string value, initializes
  exactly as before.
- On Android, if the SDK was already initialized natively (for example from your
  `Application` class), `init` does nothing and the app identifier is not
  applied; pass it to the native initializer instead.
- `reinitWithPartnerName` with a different partner name clears the app identifier on both
  platforms; calling it with the current partner name leaves it unchanged.

## Features

| Area | API entry point |
|------|-----------------|
| User attributes & login | `Insider.getCurrentUser()` → `User`, `Insider.identifier()` → `Identifier` |
| Custom events | `Insider.tagEvent(name)` → `Event` |
| Event observer | `Insider.events.addObserver(observer)` → `{ remove() }` |
| Product / purchase events | `createNewProduct`, `visitProductDetailPage`, `itemAddedToCart`, `itemPurchased`, `cartCleared`, `visitWishlistPage` |
| Smart recommendations | `getSmartRecommendation`, `getSmartRecommendationWithProduct`, `getSmartRecommendationWithProductIDs`, `clickSmartRecommendationProduct` |
| Content optimizer | `getContentStringWithName`, `getContentIntWithName`, `getContentBoolWithName`, `markContentOptimizerAsSeen` |
| Push notifications | `setPushToken` (Android), `handleNotification`, `setForegroundPushCallback` (iOS) |
| Message center | `getMessageCenterData`, `getMessageCenterDataWithIdentifiers` |
| App Cards | `Insider.appCards` → `getCampaigns`, `markAsRead`, `view`, `click`, `clickButton`, `delete` |
| In-app messages | `enableInAppMessages`, `disableInAppMessages`, `removeInapp` |
| Geofencing | `startTrackingGeofence` |
| GDPR / privacy | `setGDPRConsent`, `setMobileAppAccess`, `enableIDFACollection`, `enableIpCollection`, `enableLocationCollection`, `enableCarrierCollection` |
| Insider ID | `getInsiderID`, `registerInsiderIDListener` |

TypeScript definitions for the full surface ship with the package under
`types/`.

## Event Observer

`Insider.events` lets you observe every event recorded by the Insider SDK.

The observer is invoked as `(name, parameters, timestamp)`, mirroring the native
`onEventRecorded` callback — `[[Insider events] addObserver:]` on iOS and
`Insider.Instance.events().addObserver(...)` on Android — so the plugin reads the way the
SDK it wraps does. The React Native and Flutter wrappers expose the same surface.

```js
const subscription = Insider.events.addObserver((name, parameters, timestamp) => {
    console.log('Event name:', name);
    console.log('Event parameters:', parameters);
    console.log('Recorded at:', new Date(timestamp * 1000));
});

// Stop receiving events:
subscription.remove();
```

Each subscriber owns its own `remove()`; there is no bulk teardown, so one integrator
cannot unsubscribe another's observer.

### ⚠️ `timestamp` is in SECONDS, not milliseconds

**This is the single most common source of bugs when integrating this API.**

`timestamp` is the number of **whole seconds** since the Unix epoch
(1970-01-01T00:00:00Z). It is passed through from the native Android and iOS SDKs
**unchanged and deliberately not converted**, so that the value matches the native SDKs
exactly.

JavaScript's `Date` constructor expects **milliseconds**. You **must** multiply by 1000:

```js
new Date(timestamp * 1000);  // ✅ correct
new Date(timestamp);         // ❌ wrong - gives a date in January 1970
```

The same applies when comparing against `Date.now()`, which is also in milliseconds:

```js
const ageInSeconds = (Date.now() / 1000) - timestamp;  // ✅ correct
```

Note the contrast: a `Date` **inside `parameters`** arrives as an ISO-8601 UTC **string**
(e.g. `"2024-06-01T00:00:00.000Z"`), because the native SDKs record date parameters in that
form. Parse it with `new Date(value)`.

### Notes

- **One native observer.** The plugin registers a single native observer no matter how many
  observers you add, and fans events out on the JavaScript side. The native observer is
  unregistered automatically once the last observer is removed.
- **`remove()` is idempotent.** Calling it more than once is safe and does nothing after the
  first call.
- **Do not mutate `parameters`.** It is a read-only snapshot owned by the SDK
  (unmodifiable on Android, a defensive copy on iOS) and is deep-frozen before delivery —
  nested maps and arrays included — so one observer cannot alter what the next one sees.
- **Delivery thread.** Events originate on a dedicated SDK background thread and are
  marshalled to the WebView before your observer runs.
- **Always remove your observers** when you no longer need them (for example when tearing
  down a view), so the plugin can release the native observer.

## Documentation

- Integration guide: <https://academy.insiderone.com/docs/cordova-basic-sdk-setup>
- Changelog: <https://academy.insiderone.com/docs/cordova-changelogs>
- Sample app: <https://github.com/useinsider/CordovaDemo>
- Insider website: <https://insiderone.com/>

For panel-side setup — partner name, campaign and placement configuration —
contact your Insider account manager.

## License

cordova-plugin-insider is released under the MIT License. See
[LICENSE](LICENSE).
