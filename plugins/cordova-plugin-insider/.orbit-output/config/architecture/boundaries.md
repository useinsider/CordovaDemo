# cordova-plugin-insider — Boundaries

_Freshness: generated at 2026-06-09 against git e4fc541 on feature/MOB-26983._

## Owns
- The Cordova/hybrid JavaScript API surface for Insider (`js/`, built to `www/`, clobbered onto global `Insider`).
- The Cordova-side native bridges: `src/android/` (Java `CordovaPlugin`) and `src/ios/` (ObjC `CDVPlugin`).
- The JS↔native serialization contract (typed `{key, type, value}` arrays via `Utils.parseObjectWithTypes`; epoch-ms dates).
- Cordova install/uninstall hooks that patch the host app's Android gradle for Huawei (`hooks/`).
- The plugin's published TypeScript type definitions (`types/*.d.ts`).

## Doesn't own
- The Insider Mobile SDK behavior itself — owned by the native iOS SDK (`InsiderMobile`/`InsiderHybrid`) and Android SDK (`com.useinsider:insider`/`insiderhybrid`). This repo only wraps them.
- React Native bridging — that lives in a separate React Native SDK, not this repo.
- The host Cordova app's build/runtime; the plugin only contributes source-files, frameworks, and config-file edits via `plugin.xml`.

## Upstream dependencies (calls out to)
- Insider iOS SDK — via CocoaPods pods declared in `plugin.xml` (`InsiderMobile`, `InsiderGeofence`, `InsiderHybrid`); called through ObjC `[Insider …]` in `src/ios/InsiderPlugin.m`.
- Insider Android SDK — via Gradle in `src/android/build-extras.gradle`; called through `Insider.Instance.*` / `InsiderHybrid` in `src/android/InsiderPlugin.java`.
- Apache Cordova runtime — `cordova.exec` (JS→native) and `cordova.fireDocumentEvent` (native→JS).

## Downstream consumers (who calls this)
- Insider customers' Cordova/Ionic hybrid apps that install `cordova-plugin-insider` and call the global `Insider` API.

## Auth domain
- No auth domain of its own. Identity is partner-scoped: `partnerName` + `appGroup` passed to native `init`. The plugin holds no credentials/tokens; the native SDK manages session and Insider ID.

## Conventions (non-obvious)
- Every public JS method MUST validate inputs with `Utils.checkParameters([...])` and bail via `Utils.showParameterWarningLog` before any native call (`js/InsiderPlugin.js`, all model classes).
- All native calls go through the single path `Utils.asyncExec(Constants.CLASS, reference, args)` (`js/Utils.js:4`). Never call `cordova.exec` directly.
- Native action names are string constants centralized in `js/Constants.js` — add new actions there, mirrored in both `src/android` and `src/ios`.
- Dates cross the bridge as **epoch-millisecond strings** (`value.getTime().toString()`), not ISO, to avoid timezone drift (`js/User.js:40`, `js/Event.js:78`).
- Booleans for collection/consent flags are sent as lowercased strings (`.toString().toLowerCase()`) in `js/InsiderPlugin.js`.
- `SDK_VERSION` (`js/Constants.js`) uses the `CDV-` prefix and must be bumped together with `package.json`, `plugin.xml` pods, and `build-extras.gradle` on release.
- Platform-only methods are guarded by `cordova.platformId` and silently no-op off-platform.

## Known tech-debt
- Stale `"babel": "^6.23.0"` runtime dependency in `package.json` while the build actually uses Babel 7 (`@babel/*` devDeps) — likely removable.
- `Identifier.js` error branches reference an undefined `InsiderCordovaPlugin` symbol in `catch` blocks (`js/Identifier.js:22,37,52,67`) — would throw inside the error handler if ever hit.
- iOS callback JSON is assembled by string interpolation in `src/ios/InsiderPlugin.m` (`registerCallback:`) rather than structured serialization — fragile to special characters.
