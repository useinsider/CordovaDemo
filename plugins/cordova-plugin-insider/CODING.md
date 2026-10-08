# CODING.md — cordova-plugin-insider

Coding standards for this Cordova plugin. These encode the patterns already present in the codebase; follow them so new code is indistinguishable from existing code. For deeper context see `@.orbit-output/config/MASTER.md`.

This file is the single style source for the repo; tests follow `.claude/rules/unit-tests.md`.

## Golden rules

1. **One native call path.** Every native invocation goes through `Utils.asyncExec(Constants.CLASS, reference, args)`. Never call `cordova.exec` directly.
2. **Validate before you call.** Every public JS method validates inputs with `Utils.checkParameters([{ type, value }, …])` and, on failure, calls `Utils.showParameterWarningLog(this.constructor.name + '-<method>')` and returns early (return `this` in fluent classes).
3. **Constants, not string literals.** Native action names and product keys live in `js/Constants.js`. Reference them; don't inline strings.
4. **Mirror across platforms.** A new action requires a constant + an Android handler (`src/android`) + an iOS handler (`src/ios`) + a `types/*.d.ts` entry.

## JavaScript (`js/`)

- **Style:** `"use strict";` at the top of every module. CommonJS (`require` / `module.exports`) — the Cordova module loader and `plugin.xml`'s `<js-module>`/`<clobbers>` depend on it, and the singleton default-export shape (`module.exports = new InsiderPlugin()`) is intentional; no ESM. 4-space indent. There is no ESLint or Prettier config: match the surrounding file.
- **Naming:** classes PascalCase; methods/variables camelCase; constant keys UPPER_SNAKE_CASE (in `Constants.js`); booleans `is/has/can`. Files are `PascalCase.js` in `js/`, each registered by that exact name in `plugin.xml` and paired with `types/<Name>.d.ts` — renaming one breaks all three.
- **Public method shape:**
  ```js
  doThing = (arg) => {
      if (Utils.checkParameters([{ type: 'string', value: arg }])) {
          Utils.showParameterWarningLog(this.constructor.name + '-doThing');
          return;
      }
      try {
          Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.DO_THING, [arg]);
      } catch (error) {
          Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
      }
  };
  ```
- **Error handling:** wrap bodies in `try/catch`; route caught errors to native via `PUT_ERROR_LOG`. Do not silently swallow without logging — no `.catch(() => {})`. No `console.log` in committed code: invalid input warns through `Utils.showParameterWarningLog`.
- **Promises vs callbacks:** getter-style methods (`getMessageCenterData`, `getSmartRecommendation*`, `getContent*`) `return` the `asyncExec` Promise. App Cards methods use `Utils.resolveWithCallback(promise, completion)` to support both Promise and `(error, result)` callback styles — keep that pattern for new App Cards APIs.
- **Fluent builders** (`User`, `Product`, `Event`, `Identifier`): setters return `this`. `Product` writes to `optionalFields` using `Constants` keys; typed custom attributes push `{ type, key, value }` onto `customParameters`. `Event.build()` is the dispatch step.
- **Serialization:** convert arbitrary objects with `Utils.parseObjectWithTypes` before sending. Send dates as `value.getTime().toString()` (epoch-ms), booleans for consent/collection flags as `value.toString().toLowerCase()`.
- **Platform branching:** use `cordova.platformId` (compare against `InsiderConstants.ANDROID` / `'ios'`). Platform-only methods must no-op (early `return`) on the other platform.

## Native — Android (`src/android/`)

- Package `com.useinsider.cordova`; extend `CordovaPlugin`; dispatch in `execute(action, args, callbackContext)`.
- Run SDK/UI calls on the UI thread where the SDK requires it (`cordova.getActivity().runOnUiThread(...)`).
- Use the shared Jackson `ObjectMapper` for (de)serialization; route exceptions to `Insider.Instance.putException(e)`.
- Send callbacks to JS via `webView.loadUrl("javascript:cordova.fireDocumentEvent('ins_*', …)")`.
- Declare new native dependencies in `build-extras.gradle`.

## Native — iOS (`src/ios/`)

- Extend `CDVPlugin`; one selector per action taking `(CDVInvokedUrlCommand *)command`.
- Guard argument access (`[command.arguments objectAtIndex:n]`) before use; wrap in `@try/@catch` and report via `[Insider sendError:…]`.
- Use `CDVUtils` helpers for success/error results; send callbacks via `[self.commandDelegate evalJs:…]` firing `ins_*` document events.
- Declare new pods in `plugin.xml` `<podspec>`.

## TypeScript definitions (`types/`)

- Every public JS module/method has a matching `.d.ts`. Update types in the same change as the JS API. Keep signatures aligned with runtime validation. No `any`.

## Comments

When a comment may exist is `.claude/rules/core-comments.md`; its form here:

- A public method gets a one-line purpose doc; add `@example` only for precedence rules or tricky shapes.
- No JSDoc `@param {Type}` / `@returns {Type}` in `types/*.d.ts` — the signature is the type. In plain JS, JSDoc types only on exported functions that tooling type-checks.
- No section-divider or import-group comments.
- Tool directives stay: `/* istanbul ignore next */`, `@deprecated`. `// eslint-disable-*` and `// prettier-ignore` mean nothing here — the repo has neither tool.

## Cordova manifest & hooks

- `plugin.xml` is the source of truth for js-modules, platforms, source-files, frameworks, pods, and host-app config edits. Register new JS modules and native source files there.
- Hooks (`hooks/`) must be idempotent (guard with marker comments like existing gradle patchers) and reversible in `before_plugin_uninstall.js`.

## Don'ts

- ❌ Don't call `cordova.exec` outside `Utils.asyncExec`.
- ❌ Don't add a JS API without the Android + iOS handler and `.d.ts`.
- ❌ Don't hardcode native action strings.
- ❌ Don't send ISO date strings across the bridge.
- ❌ Don't edit `www/` by hand (it is generated by `npm run build`).
- ❌ Don't edit `.orbit-output/` by hand (regenerate with `/orbit:init` or `/orbit:sync`).
