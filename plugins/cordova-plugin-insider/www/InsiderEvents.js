"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var Utils = require('./Utils');
var Constants = require('./Constants');

/**
 * Design
 * ------
 * The native SDK exposes a single observer registration (addObserver/removeObserver).
 * Registering it once per JS subscriber would stack native observers with no way to
 * take an individual one back off, which is exactly the leak the existing
 * registerInsiderIDListener / setForegroundPushCallback APIs suffer from.
 *
 * Instead this module registers AT MOST ONE native observer per process and fans the
 * delivered events out to a JS-side subscriber set:
 *
 *   addObserver(cb)  -> first subscriber registers natively; returns { remove() }
 *   remove()         -> drops that one subscriber; the last one to leave unregisters
 *                       natively, so the process ends with zero native observers.
 *
 * The name and the callback signature deliberately mirror the native SDKs
 * (`[[Insider events] addObserver:]`, `Insider.Instance.events().addObserver(...)` and
 * `onEventRecorded(name, parameters, timestamp)`) so the wrapper reads the way the SDK it
 * wraps does. The React Native and Flutter wrappers expose the same surface.
 *
 * Subscribers are held in a Map keyed by an incrementing id so remove() is O(1) and
 * removing the same subscription twice is a no-op. The fan-out iterates a snapshot of
 * the subscriber list, so a callback that removes itself (or another subscriber)
 * cannot corrupt the iteration.
 *
 * @namespace InsiderEvents
 */

/** @type {Map<number, Function>} */
var subscribers = new Map();
var nextSubscriptionId = 1;
var isNativeObserverRegistered = false;

/**
 * Set once the native stream has delivered anything, which distinguishes a failure to register
 * the observer (retryable) from an error on an already-working stream (not retryable).
 */
var hasNativeObserverDelivered = false;

/**
 * Recursively freezes an event's parameter tree.
 *
 * Object.freeze is shallow, so freezing only the top level would leave nested maps and
 * arrays writable - and nested values are routine here, since both native sides convert
 * nested maps/arrays structurally. Without this an observer could rewrite
 * `parameters.order.total` and every later subscriber would read the tampered value
 * instead of what the SDK recorded, which is exactly the guarantee the types and docs make.
 */
function deepFreeze(value) {
  if (value === null || _typeof(value) !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  // Freeze the container before its children so a cycle reaching back to it finds it
  // already frozen rather than recursing again.
  Object.freeze(value);
  Object.keys(value).forEach(function (key) {
    deepFreeze(value[key]);
  });
  return value;
}
function dispatchToSubscribers(payload) {
  if (payload === null || _typeof(payload) !== 'object') {
    return;
  }

  // Frozen because the same map is handed to every subscriber: without it the first
  // observer could mutate parameters and the second would observe the mutation instead
  // of what the SDK recorded. The types and the docs promise a read-only snapshot; this
  // is what makes that true rather than merely stated. The freeze is deep - see above.
  var name = payload.name;
  var parameters = deepFreeze(payload.parameters || {});
  var timestamp = payload.timestamp;

  // Iterate a snapshot: an observer may call remove() on its own subscription (or on
  // another's) from inside its callback, and mutating the Map while iterating it would
  // skip the following subscribers.
  Array.from(subscribers.values()).forEach(function (observer) {
    try {
      observer(name, parameters, timestamp);
    } catch (error) {
      Utils.asyncExec(Constants.CLASS, Constants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  });
}
function registerNativeObserver() {
  if (isNativeObserverRegistered) {
    return;
  }
  isNativeObserverRegistered = true;
  hasNativeObserverDelivered = false;
  try {
    Utils.streamExec(Constants.CLASS, Constants.ADD_EVENT_OBSERVER, [], function (payload) {
      // The first payload proves the native observer is live, so later errors on this
      // stream are delivery errors, not registration failures, and must not re-arm the
      // retry - that would let a second observer stack on top of the working one.
      hasNativeObserverDelivered = true;
      dispatchToSubscribers(payload);
    }, function (error) {
      // Registration-phase failure: clear the flag so a subsequent addObserver retries.
      // Without this the stream is dead forever and events silently never arrive.
      if (!hasNativeObserverDelivered) {
        isNativeObserverRegistered = false;
      }
      Utils.asyncExec(Constants.CLASS, Constants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    });
  } catch (error) {
    // streamExec throws synchronously when window.cordova is absent (browser, or before
    // cordova.js loads). Treat it as a registration failure, otherwise the flag would stay
    // true for the whole process and every later addObserver would skip native registration.
    isNativeObserverRegistered = false;
    Utils.asyncExec(Constants.CLASS, Constants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
  }
}
function unregisterNativeObserver() {
  if (!isNativeObserverRegistered) {
    return;
  }
  isNativeObserverRegistered = false;
  hasNativeObserverDelivered = false;
  Utils.asyncExec(Constants.CLASS, Constants.REMOVE_EVENT_OBSERVER, []);
}

/**
 * Main API for observing events recorded by the Insider SDK.
 *
 * @namespace InsiderEvents
 */
var InsiderEvents = Object.freeze({
  /**
   * Subscribes to events recorded by the Insider SDK.
   *
   * The observer is invoked as `(name, parameters, timestamp)`, matching the native
   * `onEventRecorded` callback on both platforms.
   *
   * IMPORTANT: `timestamp` is expressed in WHOLE SECONDS since the Unix epoch
   * (1970-01-01T00:00:00Z), matching the native SDKs exactly. It is NOT milliseconds.
   * To build a JavaScript `Date` you MUST multiply by 1000:
   * `new Date(timestamp * 1000)`. Passing it to `new Date()` directly yields a
   * date in January 1970.
   *
   * `parameters` is a read-only snapshot owned by the SDK - do not mutate it.
   * Delivery happens on a native background thread and is marshalled to the WebView.
   *
   * @param {Function} observer - Called as `(name, parameters, timestamp)` for every recorded event.
   * @returns {{remove: Function}|undefined} A subscription handle; call `remove()` to unsubscribe.
   *
   * @example
   * const subscription = Insider.events.addObserver((name, parameters, timestamp) => {
   *   console.log(name, parameters, new Date(timestamp * 1000));
   * });
   *
   * subscription.remove();
   */
  addObserver: function addObserver(observer) {
    if (Utils.checkParameters([{
      type: 'function',
      value: observer
    }])) {
      Utils.showParameterWarningLog('InsiderEvents-addObserver');
      return;
    }
    try {
      var subscriptionId = nextSubscriptionId++;
      subscribers.set(subscriptionId, observer);
      registerNativeObserver();
      return {
        remove: function remove() {
          if (!subscribers.delete(subscriptionId)) {
            return;
          }
          if (subscribers.size === 0) {
            unregisterNativeObserver();
          }
        }
      };
    } catch (error) {
      Utils.asyncExec(Constants.CLASS, Constants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
    }
  }
});
module.exports = InsiderEvents;