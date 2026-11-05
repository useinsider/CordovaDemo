# MOB-30872 | Align CordovaDemo UI with FlutterDemo and close its feature gaps

Jira: MOB-30872 (the ticket description and "Descriptions of Product / Service" field are the source of the acceptance criteria; this document adds what the conversation settled and what the repo showed).

## Intent

CordovaDemo is the reference integration partners copy and the harness Mobile QA uses to verify a Cordova SDK release. Today it uses the old black-button layout, prints SDK results only to Xcode / logcat, and has no button for several plugin APIs that FlutterDemo and ReactNativeDemo exercise. After this work:

- CordovaDemo looks like FlutterDemo (same colours, Kufam font, cards, layout).
- Every SDK action prints its result to an on-screen console, so a tester never needs a debugger to see whether a call worked.
- Every public plugin API that the other demos exercise has a button.

## Goals

1. FlutterDemo's visual system in CordovaDemo: colour tokens, Kufam type, card treatment, metrics.
2. Home page rebuilt to FlutterDemo's structure: logo bar with clear button, fixed output console, action sections, floating "Apps" button opening a mini-apps sheet.
3. App Cards page (`www/app-cards.html`, MOB-28025) restyled onto the same tokens with no behaviour change.
4. Buttons for the missing APIs (see "Feature gap", corrected below).
5. README updated with iOS and Android screenshots of the new home and the mini-apps sheet, and setup steps checked against the project.
6. Verified on an iOS simulator and an Android emulator by the implementer (not handed to the user).

## Non-goals

- No change to `cordova-plugin-insider`, its native bridge, `config.xml` plugin list or native platform code.
- No change to FlutterDemo, ReactNativeDemo or the native demo apps.
- No App Frames: the plugin has no App Frames API, and the mini-apps sheet gets no placeholder for it.
- No input forms. Like FlutterDemo, every button calls the SDK with fixed sample values.

## Anti-goals (would be a failure even if it "works")

- A redesigned page where any existing action stops working or loses its result output (Social Proof, Mobile App Access and Message Center included).
- Hex colours scattered across stylesheets or inline styles instead of tokens.
- Tests loosened or deleted to make the redesign pass. Test changes must follow real behaviour changes (button count, new buttons, platform-only APIs) and must be stated in the PR.
- Touching the user's main checkout. Its uncommitted sdk-run changes (`www/index.html`, `www/js/index.js`, `package.json`, `platforms/…`, `*.sdkrun-bak`) are unrelated and must stay untouched.

## Constraints and facts from the repo

- **Work location:** git worktree `../CordovaDemo-MOB-30872`, branch `feature/MOB-30872`, created from `origin/main` (`ca86283`). Local `main` (`fbf4e77`) is stale; `origin/main` already moved the demo to `cordova-plugin-insider` `^4.1.0` and added a Jest suite.
- **Plugin:** published `cordova-plugin-insider` 4.1.0, also vendored under `plugins/cordova-plugin-insider/`. All new APIs exist there and are implemented natively on both platforms, except `setAllowsBackgroundLocationUpdates`, which is iOS-only: the plugin JS returns early on Android without a native call (`plugins/cordova-plugin-insider/www/InsiderPlugin.js:556`).
- **Design reference:** FlutterDemo `origin/main` (local FlutterDemo `main` is stale and lacks MOB-26643; read with `git show origin/main:<path>`):
  - colours `lib/theme/insider_colors.dart`, metrics `lib/theme/insider_theme.dart` (card radius 18, control radius 14, button height 60, console height 124);
  - home `lib/main.dart` (`_PlaygroundTopBar`, `PlaygroundConsole`, section list, FAB "Apps");
  - components `lib/components/` (`playground_button`, `custom_title`, `insider_card`, `playground_console`, `mini_apps_sheet`);
  - assets `assets/fonts/Kufam-{Regular,Medium,SemiBold}.ttf` (Bold exists but is not used), `assets/images/insider-one.png`.
- **Tests (`npm test`, Jest + jsdom, also run in CI `.github/workflows/run-tests.yml`):**
  - `test/support/indexPageSuite.js` finds home buttons with the regex `<input[^>]*class="insider-button[^"]*"[^>]*id="…"`, asserts the count is 28, clicks every button on a faked iOS and Android bridge, and fails if a click throws, logs an error/warning, makes no native call (except `createProduct`, `appCards`), or calls a native action the platform does not implement.
  - `test/domIds.test.js` requires every `getElementById` target to exist and every `.insider-button[id]` to be wired in `js/index.js`.
  - Existing specific tests: `clickSmartRecommendationProduct` argument order, `contentOptimizerNoCache` call order, `login` / `logoutResettingInsiderID` `alert(...)` text, `appCards` saving `homeScrollY`.
- **Repo convention:** prepared copies of `www/` under `platforms/android/app/src/main/assets/www/` (and the iOS equivalent) are committed alongside `www/` changes (see `d02d294`, MOB-28025).

## Corrected feature gap

The ticket lists eight APIs. "Content Optimizer without cache" already exists on `origin/main` (`www/js/index.js:317`, button `contentOptimizerNoCache`, methods `getContent{Int,String,Bool}WithoutCache`), so seven are new. Placement follows FlutterDemo: features live under buttons inside sections, and one button may call several APIs.

| API | Where | How |
|---|---|---|
| `itemAddedToWishlist`, `itemRemovedFromWishlist`, `wishlistCleared`, `visitWishlistPage` | New **Wishlist** section | Four buttons as in FlutterDemo `lib/insider/wishlist.dart`: "Add to Wishlist", "Remove from Wishlist", "Clear Wishlist", "Visit Wishlist Page" (two sample products) |
| `enableInAppMessages`, `disableInAppMessages` | **In-App Messages** section | Two new buttons "Enable InApp", "Disable InApp", next to the existing "Remove In-App" |
| `startTrackingGeofence` | New **Geofence** section | Button "Start Tracking Geofence" (the call at init stays) |
| `setAllowsBackgroundLocationUpdates` | **Geofence** section | Button "Allow Background Location Updates" calling it with `true`. On Android the console states it is iOS-only and no native call is made |
| `getSmartRecommendationWithProduct` | **Smart Recommender** section | Added inside the existing "Get Smart Recommender Data" button, as FlutterDemo does (three calls, three console lines). No new button |
| `addParameterWithArray` | **Event** section | Added as a parameter on the existing "Trigger Events" event. No new button |
| `reinitWithPartnerName` | New **Reinit** section, last | Button "Reinit With Partner Name" calling it with the same `'your_partner_name'` placeholder used by `init` (`www/js/index.js:54`, FIXME). Console prints the active partner name |

## Home page

Top to bottom, on the iOS cream canvas (`#EFEBE4`), identical on iOS and Android:

1. **Logo bar:** `insider-one.png` centred (26px high); round white 40px clear button on the right that empties the console.
2. **Output console:** fixed 124px white card, does not scroll away with the page; scrolls internally and jumps to the newest line; long JSON wraps inside it. Keeps the most recent 200 lines.
3. **Sections:** each is a title (FlutterDemo `custom_title`) followed directly by its gradient buttons (`#E92E2F → #FF6126`, 60px, control radius 14, FlutterDemo `playground_button` padding) on the cream canvas, with no card around them, exactly as FlutterDemo `lib/main.dart:115-140` does. Buttons are full width, except where FlutterDemo or today's CordovaDemo pairs them two per row (Purchase, Page Visit Methods, GDPR, Login / Logout, Mobile App Access True / False). Bottom padding so the floating button never covers the last button.

   The ticket's "every card surface is white, 18px radius, 1px outline, no shadow" applies to the surfaces that are cards: the output console, the mini-apps sheet rows and the App Cards page cards. Decided with the user on 2026-11-05: matching FlutterDemo wins over wrapping sections in cards.
4. **"Apps" floating button:** navy, bottom right, over the sections; opens a bottom sheet with one row, "App Cards – Inbox campaigns from the panel", which opens `app-cards.html` (keeping the existing `homeScrollY` save).

Section order: FlutterDemo's order, with Cordova-only sections kept where they are today:

User Attributes · User Identifiers · Event · Product · Purchase · Smart Recommender · **Social Proof** · Page Visit Methods · GDPR · **Mobile App Access** · **Message Center** · App Cards · Content Optimizer · Geofence · In-App Messages · Wishlist · Reinit

The home App Cards section stays but, as in FlutterDemo `lib/insider/app_cards.dart`, its button becomes "Get Campaigns Data (Console)": it calls the plugin's App Cards `getCampaigns` and writes the count and each card (id, title, description, read, image and button counts) to the console, or the error. It no longer navigates. The App Cards page is reached only through Apps → App Cards, which saves `homeScrollY` before navigating, as the home button does today. Decided with the user on 2026-11-05.

Safe-area insets use `env(safe-area-inset-*)` (the viewport already has `viewport-fit=cover`).

## Output console

One logger in `www/js/index.js`, mirroring FlutterDemo's `logInsider`: it appends a line to the on-screen console and also calls `console.log`. Line format follows FlutterDemo: `[INSIDER][methodName]: <result>` or `[INSIDER][methodName]: Method is triggered.`; objects are `JSON.stringify`-ed; errors are written as `[INSIDER][methodName] error: <message>`. Every existing handler is routed through it; the init sequence and the push / temp-store callbacks write to it too. No timestamp: the ticket's implementation pointer mentions one, but the acceptance criterion says "as in FlutterDemo", and FlutterDemo has none.

Existing `alert(...)` calls on login / logout-resetting stay (tests assert them); their text is also written to the console.

## Styling

- `www/css/index.css` becomes the single token stylesheet: CSS custom properties for every FlutterDemo colour plus radii and heights, `@font-face` for the three Kufam weights from `www/fonts/`, and the home component styles.
- `www/css/app-cards.css` keeps its rules but replaces every hex value with the tokens (it loads `index.css` first or the tokens move to a shared file; builder's choice, as long as hex values exist in exactly one stylesheet). No behaviour change in `www/js/app-cards.js`; class names only if needed.
- No inline `style=""` with colours (the current Logout button's inline colour goes).
- Check: `grep -rniE '#[0-9a-f]{3,8}\b' www/` finds colours only in the token stylesheet.

## Tests

The suite must stay green and grow with the change:

- Keep home buttons as `<input type="button" class="insider-button …" id="…">` with `class` before `id`, so the suite's discovery regex keeps working (my call; the alternative is changing the regex).
- Update the expected button count from 28 to the new total and keep the uniqueness check.
- Add specific tests: each Wishlist button sends its native action; Enable / Disable InApp send theirs; Smart Recommender now calls `getSmartRecommendation`, `getSmartRecommendationWithProduct`, `getSmartRecommendationWithProductIDs`; Trigger Events carries the array parameter; Reinit sends `reinitWithPartnerName` with the placeholder; a click writes a line to the on-screen console and the clear button empties it; the Apps button opens the sheet and its App Cards row saves `homeScrollY` and navigates; the home App Cards button logs the campaigns to the console.
- The `appCards` button now makes a native call (`getAppCardsCampaigns`), so it leaves `NO_NATIVE_CALL`; the `homeScrollY` test moves to the mini-apps sheet's App Cards row.
- `setAllowsBackgroundLocationUpdates` makes no native call on Android by design. Its button gets a per-platform exemption from the "must call native" rule on Android only, with the reason in the PR description; on iOS it must call the native action.
- Run `npm test` before every hand-over.

## README

- Screenshots of the new home and the mini-apps sheet on iOS and Android, stored in `assets/readme/` (matches FlutterDemo's `assets/readme/`; the ticket says "a `readme/` assets folder"). They replace `assets/preview.gif` in the Preview section.
- Re-check installation steps against the project (plugin 4.1.0 from npm, `cordova-ios` / `cordova-android` versions, `npm test`, iOS extension pods script) and fix what no longer matches.
- Academy check; if the docs are outdated, open a follow-up Jira task (draft shown to the user first).

## Verification (done by the implementer)

- `npm test` green.
- `cordova build ios` and `cordova build android` succeed against the published plugin.
- iOS simulator and Android emulator: tap every existing and new button once and see its result in the console; clear empties it; Apps → App Cards opens the App Cards page, which still loads, refreshes and records impressions / clicks as before.
- Side-by-side screenshot comparison with FlutterDemo home on both platforms for order, colours, font and card style.
- The hex grep above.
- Then, per org rules, push through `/push-gate:push`, open the PR (not before the user asks), and propose the mobile manual test.

## Left to the builder

- Exact HTML structure and class names beyond the `insider-button` constraint.
- Bottom-sheet animation and backdrop details, within FlutterDemo's look.
- Whether tokens live in `index.css` alone or a separate `tokens.css` both pages load, as long as one file holds all hex values.
- Button labels for existing actions stay as they are unless FlutterDemo uses a different label for the same action, in which case FlutterDemo's label wins.
