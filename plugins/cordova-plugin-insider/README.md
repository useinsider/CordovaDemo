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
| cordova-android | `>=13.0.0` |
| cordova-ios | `>=7.0.0` |
| Android | `minSdk 24`, `compileSdk 36` |
| iOS | deployment target `13.0` (CocoaPods and Swift Package Manager) |

On iOS the plugin installs the Insider SDKs through one of two channels,
chosen by your `cordova-ios` version. You do not need to configure anything.

| cordova-ios | Channel | What you do |
|-------------|---------|-------------|
| `>=8.0.0` | Swift Package Manager (`Package.swift`) | Use `cordova-plugin-insider` `4.2.0` or later. Set the iOS deployment target to `13.0` or later. Xcode resolves the package on build; CocoaPods is not needed for Insider. |
| `<8.0.0` | CocoaPods (`InsiderMobile 16.5.1`, `InsiderGeofence 1.3.0`) | Set the iOS deployment target to `13.0` or later, then run `cd platforms/ios && pod install` after adding the platform. |

InsiderMobile 16.5 needs iOS 13.0, so on the CocoaPods channel set
`<preference name="deployment-target" value="13.0" />` in your app's
`config.xml` (cordova-ios 6 and 7 default to 11.0). If `pod install` fails
with a platform-version error after you upgrade the plugin, your app is still
below 13.0: set this preference and run `pod install` again.

### Moving to Swift Package Manager

CocoaPods trunk becomes read-only on December 2, 2026. Apps that use CocoaPods
keep building and published pods stay installable, but new Insider iOS SDK
versions ship only through Swift Package Manager, so we recommend moving to
`cordova-ios` 8. Android is not affected.

Requirements: `cordova-plugin-insider` `4.2.0` or later, `cordova-ios` `8.0.0`
or later, Node.js `20.17.0` or later on Node 20 (or
`22.9.0` or later), and an iOS deployment target of `13.0` or later. With
Xcode 27 or later, `cordova-ios` 8 raises the deployment target to `15.0`.

1. **Back up your extensions.** `cordova platform rm ios` deletes
   `platforms/ios`, including Notification Service and Content extension
   targets you added in Xcode. Back up their folders (source, `Info.plist`,
   bridging header, entitlements) and note their bundle IDs, App Group and
   signing.
2. **Move to cordova-ios 8.** Set
   `<preference name="deployment-target" value="13.0" />` in `config.xml`,
   update this plugin, then:

   ```bash
   cordova platform rm ios
   cordova platform add ios@8
   ```

   The Insider pods are no longer in the `Podfile`; the SDK arrives through
   Swift Package Manager. cordova-ios 8 names the Xcode project and app target
   `App`.
3. **Notification extensions** (only if you use them):
   - Add the `InsiderMobileAdvancedNotification` library of the Insider iOS
     SDK package to the **`App` target** (Up to Next Major Version, minimum
     `2.5.1`). Add nothing to the extension targets: a library added only to
     the extensions is not embedded, and the extensions crash at launch. The
     plugin does not add this library for you.
   - Add the extension targets again and copy back their code; the code does
     not change.
   - Run `cordova build ios` once, then copy `InsiderInterface.storyboard`
     from
     `~/Library/Developer/Xcode/DerivedData/App-*/SourcePackages/checkouts/Insider-iOS-SDK/`
     into the Content extension target. The package does not add it. Open
     the storyboard and check **Inherit Module From Target** in the Identity
     Inspector.
4. **Clean build.** Delete `~/Library/Developer/Xcode/DerivedData/App-*` and
   run `cordova build ios`. Repeat whenever the native SDK version changes.
5. **Verify.** After `cordova build ios --emulator`,
   `platforms/ios/build/Debug-iphonesimulator/<YourAppName>.app/Frameworks`
   contains `InsiderMobile`, `InsiderGeofence` and (with extensions)
   `InsiderMobileAdvancedNotification`, and `platforms/ios/Podfile` has no
   Insider pod. Then test rich and interactive push on a physical device.

**Rollback.** Run `cordova platform rm ios` and `cordova platform add ios@7`,
then add the extension targets again without the copied storyboard (the pod
ships it). In `platforms/ios/Podfile`, put `use_frameworks!` at the top and add
`pod 'InsiderMobileAdvancedNotification'` with `inherit! :search_paths` to both
extension targets. Run `pod install` and build from the `.xcworkspace`.
`cordova build` regenerates the Podfile and drops the extension blocks; restore
them and run `pod install` again after each build.

| Symptom | Fix |
|---------|-----|
| `unable to resolve module dependency: 'InsiderMobileAdvancedNotification'` | Add the library to the `App` target. |
| Extension crashes: `dyld: Library not loaded: @rpath/InsiderMobileAdvancedNotification.framework` | Move the library from the extension targets to `App`. |
| Content extension crashes; push shows without its image | Copy `InsiderInterface.storyboard` into the Content extension target. |
| `Insider.h has been modified since the module file … was built` | Delete `DerivedData/App-*` and build again. |
| Rollback: `Cycle inside NotificationContent` | Remove the copied storyboard; the pod provides it. |
| Rollback: `InsiderPushNotification.h' file not found` after `cordova build` | Restore the extension blocks in the Podfile and run `pod install`. |

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
| App Cards | `Insider.appCards` → `getCampaigns`, `getCampaignsWithIdentifiers`, `markAsRead`, `view`, `click`, `clickButton`, `delete` |
| In-app messages | `enableInAppMessages`, `disableInAppMessages`, `removeInapp` |
| Geofencing | `startTrackingGeofence` |
| GDPR / privacy | `setGDPRConsent`, `setMobileAppAccess`, `enableIpCollection`, `enableLocationCollection`, `enableCarrierCollection` |
| Insider ID | `getInsiderID`, `registerInsiderIDListener` |

**Breaking:** `enableIDFACollection` was removed on every platform, so no IDFA is collected through
the plugin; remove any call to it when upgrading.

**Breaking (iOS):** the plugin no longer requests App Tracking Transparency permission. An app that
relied on it to show the ATT prompt must now request that permission itself
(`ATTrackingManager.requestTrackingAuthorization`).

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
