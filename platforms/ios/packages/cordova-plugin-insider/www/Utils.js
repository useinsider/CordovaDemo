"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var OBJECT_KEY_PATTERN = /^[a-z][0-9a-z_]*$/;
module.exports = {
  asyncExec: function asyncExec(className, reference) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return new Promise(function (resolve, reject) {
      window.cordova.exec(resolve, reject, className, reference, args);
    });
  },
  /**
   * Streaming counterpart of asyncExec.
   *
   * asyncExec wraps cordova.exec in a Promise, and a Promise settles exactly once,
   * so it cannot carry a native callback that fires repeatedly. streamExec keeps the
   * success handler alive: the native side sends keep-callback plugin results and
   * every one of them invokes onData. Errors are routed to onError (if supplied)
   * without tearing the stream down on the JS side.
   *
   * @param {string} className - Native class name (Constants.CLASS).
   * @param {string} reference - Native action name.
   * @param {Array} [args] - Arguments forwarded to native.
   * @param {Function} onData - Called for every result the native side pushes.
   * @param {Function} [onError] - Called for every error the native side pushes.
   */
  streamExec: function streamExec(className, reference) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var onData = arguments.length > 3 ? arguments[3] : undefined;
    var onError = arguments.length > 4 ? arguments[4] : undefined;
    window.cordova.exec(function (result) {
      if (typeof onData === 'function') {
        onData(result);
      }
    }, function (error) {
      if (typeof onError === 'function') {
        onError(error);
      }
    }, className, reference, args);
  },
  generateJSONErrorString: function generateJSONErrorString(error) {
    return '[InsiderCordova][JavaScriptError] ' + error;
  },
  checkParameters: function checkParameters(parameters) {
    return parameters.some(function (parameterConfig) {
      switch (parameterConfig.type) {
        case "numeric_array":
          if (!Array.isArray(parameterConfig.value)) {
            return true;
          }
          return !parameterConfig.value.every(function (item) {
            return typeof item === "number";
          });
        case "string_array":
          if (!Array.isArray(parameterConfig.value)) {
            return true;
          }
          return !parameterConfig.value.every(function (item) {
            return typeof item === "string";
          });
        default:
          return parameterConfig.type !== _typeof(parameterConfig.value);
      }
    });
  },
  showParameterWarningLog: function showParameterWarningLog(functionName) {
    console.warn("[InsiderCordova] paramaters is not valid, function: " + functionName);
  },
  // The native ...WithInt APIs take a 32-bit int, so a larger JS number cannot be sent as-is.
  isOutOfInt32Range: function isOutOfInt32Range(value) {
    return typeof value === 'number' && (value > 2147483647 || value < -2147483648);
  },
  showIntRangeWarningLog: function showIntRangeWarningLog(functionName) {
    console.warn('[InsiderCordova] ' + functionName + ' ignored: the value is outside the 32-bit integer range.');
  },
  isPlainObject: function isPlainObject(value) {
    if (value === null || _typeof(value) !== 'object') {
      return false;
    }
    return Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
  },
  isValidDate: function isValidDate(value) {
    return value instanceof Date && Number.isFinite(value.getTime());
  },
  // `depth` is the level of the keys being serialized: 1 for the object passed in, 2 for a nested
  // object. Native supports two levels, so a plain object found at depth 2 is dropped (type
  // 'unknown') rather than recursed into, which lets droppedKeyPaths name it.
  parseObjectWithTypes: function parseObjectWithTypes(parameters) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    if (!this.isPlainObject(parameters)) {
      return [];
    }
    var allowNestedObjects = options.allowNestedObjects === true;
    return Object.entries(parameters).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      // Native drops an object key outside its attribute naming rule, so it is dropped here
      // too, which lets droppedKeyPaths warn about it instead of losing it silently.
      if (allowNestedObjects && !OBJECT_KEY_PATTERN.test(key)) {
        return {
          key: key,
          type: 'unknown',
          value: value
        };
      }
      if (allowNestedObjects && _this.isPlainObject(value)) {
        if (depth >= 2) {
          return {
            key: key,
            type: 'unknown',
            value: value
          };
        }
        var nestedValue = _this.parseObjectWithTypes(value, options, depth + 1);

        // A nested object that serializes to nothing would be written as an empty object,
        // so it is dropped like an empty array below rather than sent.
        if (nestedValue.length === 0) {
          return {
            key: key,
            type: 'unknown',
            value: value
          };
        }
        return {
          key: key,
          type: 'object',
          value: nestedValue
        };
      }

      // On the nested path a Set of strings or of finite numbers is accepted as an array;
      // an empty or mixed-type Set falls through to detectType's array rules and is dropped.
      var normalizedValue = allowNestedObjects && value instanceof Set ? Array.from(value) : value;

      // On the nested path an empty array carries nothing native can use, so it is dropped
      // instead of being sent as an empty numeric_array. The plain path keeps its behavior.
      if (allowNestedObjects && Array.isArray(normalizedValue) && normalizedValue.length === 0) {
        return {
          key: key,
          type: 'unknown',
          value: normalizedValue
        };
      }
      var type = _this.detectType(normalizedValue);
      return {
        key: key,
        type: type,
        value: type === 'date' ? normalizedValue.getTime() : normalizedValue
      };
    }).filter(function (param) {
      return param.type !== 'unknown';
    });
  },
  parseObjectWithNestedTypes: function parseObjectWithNestedTypes(object) {
    return this.parseObjectWithTypes(object, {
      allowNestedObjects: true
    });
  },
  // Serializes an array-of-objects payload. `paths` names everything left out of `typedObjects`:
  // a dropped key by its path, and an element that is not an object, or that serializes to
  // nothing and has no key path to name, by its index.
  parseObjectArrayWithNestedTypes: function parseObjectArrayWithNestedTypes(objects) {
    var _this2 = this;
    var typedObjects = [];
    var paths = [];
    if (!Array.isArray(objects)) {
      return {
        typedObjects: typedObjects,
        paths: paths
      };
    }
    objects.forEach(function (object, index) {
      if (!_this2.isPlainObject(object)) {
        paths.push(String(index));
        return;
      }
      var typedObject = _this2.parseObjectWithNestedTypes(object);
      var droppedPaths = _this2.droppedKeyPaths(object, typedObject, String(index));
      if (typedObject.length === 0) {
        paths.push.apply(paths, _toConsumableArray(droppedPaths.length > 0 ? droppedPaths : [String(index)]));
        return;
      }
      typedObjects.push(typedObject);
      paths.push.apply(paths, _toConsumableArray(droppedPaths));
    });
    return {
      typedObjects: typedObjects,
      paths: paths
    };
  },
  // A match that loses an entry during serialization would select more objects than the caller
  // asked for, so callers refuse it instead of narrowing silently.
  // Precondition: `typed` is the output of parseObjectWithNestedTypes(source). Comparing entry
  // counts per level is equivalent to "nothing was dropped" only because the serializer can
  // drop entries but never add them.
  isLosslessTypedObject: function isLosslessTypedObject(source, typed) {
    var _this3 = this;
    if (!this.isPlainObject(source) || !Array.isArray(typed)) {
      return false;
    }
    if (Object.keys(source).length !== typed.length) {
      return false;
    }
    return typed.every(function (param) {
      return param.type !== 'object' || _this3.isLosslessTypedObject(source[param.key], param.value);
    });
  },
  // Dot-joined key path of every entry present in `source` but missing from `typed`.
  // Same precondition as isLosslessTypedObject.
  droppedKeyPaths: function droppedKeyPaths(source, typed) {
    var _this4 = this;
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    if (!this.isPlainObject(source) || !Array.isArray(typed)) {
      return [];
    }
    var typedByKey = new Map(typed.map(function (param) {
      return [param.key, param];
    }));
    return Object.keys(source).reduce(function (paths, key) {
      var path = prefix ? prefix + '.' + key : key;
      var param = typedByKey.get(key);
      if (!param) {
        // A nested object within the depth limit is only missing because every one of
        // its keys was dropped, so name those keys instead of the object itself.
        var childKeys = depth < 2 && OBJECT_KEY_PATTERN.test(key) && _this4.isPlainObject(source[key]) ? Object.keys(source[key]) : [];
        paths.push.apply(paths, _toConsumableArray(childKeys.length > 0 ? childKeys.map(function (childKey) {
          return path + '.' + childKey;
        }) : [path]));
        return paths;
      }
      if (param.type === 'object') {
        paths.push.apply(paths, _toConsumableArray(_this4.droppedKeyPaths(source[key], param.value, path, depth + 1)));
      }
      return paths;
    }, []);
  },
  showLossyMatchWarningLog: function showLossyMatchWarningLog(functionName) {
    var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathList = Array.isArray(paths) ? paths.join(', ') : '';
    console.warn('[InsiderCordova] ' + functionName + ' ignored: the match contains values that cannot be sent to native (' + pathList + '). Sending the rest would match more objects than requested.');
  },
  showDroppedValuesWarningLog: function showDroppedValuesWarningLog(functionName) {
    var paths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var anythingSent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var pathList = Array.isArray(paths) ? paths.join(', ') : '';
    console.warn('[InsiderCordova] ' + functionName + ' dropped values that cannot be sent to native: ' + pathList + (anythingSent ? '. The rest of the call was still sent.' : '. Nothing was left to send, so the call was ignored.'));
  },
  detectType: function detectType(value) {
    // Non-finite numbers (NaN, Infinity) and invalid Dates are rejected on both flat and nested paths by design.
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (value instanceof Date) {
      return Number.isFinite(value.getTime()) ? 'date' : 'unknown';
    }
    if (Array.isArray(value)) {
      // A single NaN or Infinity anywhere makes the whole array unsendable, matching the
      // finite-number rule applied to a lone number below.
      if (value.every(function (item) {
        return typeof item === 'number' && Number.isFinite(item);
      })) {
        return 'numeric_array';
      }
      if (value.every(function (item) {
        return typeof item === 'string';
      })) {
        return 'string_array';
      }
      return 'unknown';
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      if (Number.isInteger(value)) {
        return 'integer';
      }
      return 'double';
    }
    if (typeof value === 'string') {
      return 'string';
    }
    return 'unknown';
  },
  resolveWithCallback: function resolveWithCallback(promise, completion) {
    if (typeof completion === 'function') {
      promise.then(function (result) {
        return completion(null, result);
      }).catch(function (error) {
        return completion(error, null);
      });
      return;
    }
    return promise;
  }
};