/**
 * Parameters attached to a recorded Insider event.
 *
 * This is a read-only snapshot owned by the SDK (unmodifiable on Android, a defensive
 * copy on iOS). Do not mutate it. The plugin deep-freezes the whole tree before fan-out,
 * so nested maps and arrays are frozen too and one observer cannot alter what the next
 * one receives.
 *
 * ⚠️ **Date parameter values arrive as ISO-8601 STRINGS** (UTC, e.g.
 * `"2024-06-01T00:00:00.000Z"`), on both platforms: the native SDKs store a date
 * parameter as that formatted string when the event is recorded, so the observer receives
 * a `string`, not a `Date` or an epoch number. Parse it with `new Date(value)`. This is a
 * different representation from the callback's top-level `timestamp`, which is a number
 * of SECONDS.
 *
 * ```typescript
 * Insider.events.addObserver((name, parameters, timestamp) => {
 *   // A Date parameter recorded as 2024-06-01T00:00:00Z:
 *   parameters.last_seen;                 // "2024-06-01T00:00:00.000Z"
 *   new Date(parameters.last_seen);       // ✅ parses the ISO string
 *
 *   // Contrast with the event's own timestamp:
 *   new Date(timestamp * 1000);           // ✅ seconds -> milliseconds
 * });
 * ```
 *
 * Other value types map as expected: strings stay strings, numbers stay numbers,
 * booleans stay booleans, and nested maps/arrays are converted structurally. `null`
 * parameter values are preserved rather than dropped.
 */
export type InsiderRecordedEventParameters = {
  readonly [key: string]: any;
};

/**
 * Callback invoked for every event recorded by the Insider SDK.
 *
 * ⚠️ `timestamp` IS IN **SECONDS**, NOT MILLISECONDS. ⚠️
 *
 * @param name - The event name, exactly as recorded by the SDK.
 * @param parameters - Read-only event parameters.
 * @param timestamp - Whole seconds since the Unix epoch. Convert with
 *                    `new Date(timestamp * 1000)`.
 */
export type InsiderEventRecordedCallback = (
  name: string,
  parameters: InsiderRecordedEventParameters,
  timestamp: number
) => void;

/**
 * Handle returned by {@link InsiderEvents.addObserver}.
 */
export interface InsiderEventSubscription {
  /**
   * Unsubscribes this observer.
   *
   * Calling it more than once is safe and does nothing after the first call. When the last
   * remaining subscription is removed, the plugin unregisters its native observer.
   */
  remove(): void;
}

/**
 * Main API for observing events recorded by the Insider SDK.
 *
 * Mirrors the native SDK namespaces — `[[Insider events] addObserver:]` on iOS,
 * `Insider.Instance.events().addObserver(...)` on Android — so the wrapper reads
 * the way the SDK it wraps does.
 *
 * The plugin registers at most one native observer per process and fans the delivered
 * events out to every JS subscriber, so adding and removing observers is cheap and
 * individual observers can be removed independently.
 *
 * Delivery originates on a dedicated SDK background thread and is marshalled to the
 * WebView before your callback runs.
 */
export interface InsiderEvents {
  /**
   * Subscribes to events recorded by the Insider SDK.
   *
   * ## ⚠️ `timestamp` is in SECONDS, not milliseconds
   *
   * The `timestamp` argument is passed through from the native SDKs **unchanged**, in
   * **whole seconds** since the Unix epoch (this is deliberate — it keeps parity with the
   * native Android/iOS SDKs). JavaScript's `Date` constructor and `Date.now()` both use
   * **milliseconds**, so you MUST multiply by 1000 before building a `Date`:
   *
   * ```typescript
   * Insider.events.addObserver((name, parameters, timestamp) => {
   *   const date = new Date(timestamp * 1000); // ✅ correct — timestamp is in SECONDS
   *   // const wrong = new Date(timestamp);    // ❌ WRONG — yields a date in 1970
   * });
   * ```
   *
   * ## Threading
   *
   * The native SDK delivers on a dedicated background thread; the plugin marshals delivery
   * to the WebView before your callback runs. Keep the callback cheap and non-blocking.
   *
   * ## Parameters are read-only
   *
   * `parameters` is unmodifiable on Android / a defensive copy on iOS, and is frozen before
   * being handed to subscribers. Do not mutate it.
   *
   * ## Unsubscribing
   *
   * This method returns a subscription. Call `remove()` on it to unsubscribe — important
   * because this fires on EVERY event. Multiple subscribers are supported; the native
   * observer is registered once and torn down only when the last subscriber is removed.
   *
   * @param observer - Invoked as `(name, parameters, timestamp)` for each recorded event.
   * @returns A subscription handle; call `remove()` to unsubscribe. Returns `undefined`
   * when `observer` is not a function (the plugin logs a warning and does nothing).
   *
   * @example
   * ```typescript
   * const subscription = Insider.events.addObserver((name, parameters, timestamp) => {
   *   console.log('Event:', name);
   *   console.log('Parameters:', parameters);
   *   console.log('Recorded at:', new Date(timestamp * 1000)); // seconds → ms
   * });
   *
   * // Later, when you no longer need the events:
   * subscription.remove();
   * ```
   */
  addObserver(
    observer: InsiderEventRecordedCallback
  ): InsiderEventSubscription | undefined;
}

declare const InsiderEvents: InsiderEvents;
export default InsiderEvents;
