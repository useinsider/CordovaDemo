# Test Coverage — cordova-plugin-insider

- **Test Frameworks**:
  - **Unit**: Jest 30 (`npm run test:unit`)
  - **Integration**: Jest 30 (`npm run test:integration`)
- **Scope**: tests cover the JavaScript bridge layer (`js/`) only. Native code is not unit-tested in this repo, and a second test runner or layout is not allowed (`.claude/rules/unit-tests.md`).

Group rule ("whose is the SUT?"): a test that drives the production object graph — `js/InsiderPlugin` (the global `Insider`), `js/InsiderAppCards` or `js/InsiderEvents` — is integration and is named `*.integration.test.js`. A test that builds its own subject (`new User()`, `new InsiderAppCard(...)`, a `Utils` helper) is unit, the default for every other `*.test.js`. Guard: `bash devops/check_test_groups.sh`.

## Test Layer Selection

| Change | Expectation |
|--------|-------------|
| New/changed public method on `js/InsiderPlugin.js`, `js/InsiderAppCards.js` or `js/InsiderEvents.js` | **INTEGRATION** — assert the exact `Utils.asyncExec` arguments, validation bail-outs and platform branches |
| New/changed method on a builder or helper (`User`, `Product`, `Event`, `Identifier`, `Utils`, App Card models/errors) | **UNIT** — construct the SUT directly, assert the serialized shape |
| Native-only change (`src/android/**`, `src/ios/**`) | No test possible in either group: there is no JVM or XCTest harness here. Do not request one; note whether the JS wire contract (the `asyncExec` argument array) is unchanged and whether a Jest test already pins it. |
| Native SDK pin bumps (`plugin.xml` pods, `src/android/build-extras.gradle`) | None — non-behavioral |

## Before Reporting a Missing Test

A method is tested if any of these holds; check all of them before reporting a gap:
- **Any file under `__tests__/` drives it**, not only the file named after the module. Per-feature and per-area files are normal here: `__tests__/markContentOptimizerAsSeen.integration.test.js` covers `InsiderPlugin.markContentOptimizerAsSeen`, and `__tests__/InsiderPlugin.<area>.integration.test.js` files split the plugin suite.
- **It is a row in a `test.each` table.** Each row is a full test: `User.setPromotionalOptin` is covered by the boolean optin setters table and the catch-sites table in `__tests__/User.test.js`.
- **`npm run test:coverage` shows the file at 100%** and the changed lines are not new behaviour.

## Ignore Rules

DO NOT require tests for:
- `src/android/**` and `src/ios/**` — native handlers; validated by the native SDKs' own suites and by manual integration in a host Cordova app
- `www/**` — Babel output of `js/`
- `types/**` — TypeScript declarations
- `hooks/**` — install/uninstall gradle patchers, validated by plugin add/remove round-trips
- `devops/**`, `.github/**` — release and CI automation
- Doc-only, comment-only and formatting-only diffs
- Version-bump-only changes to `package.json`, `plugin.xml`, `js/Constants.js` `SDK_VERSION`, `src/android/build-extras.gradle`
- Deletion-only diffs
