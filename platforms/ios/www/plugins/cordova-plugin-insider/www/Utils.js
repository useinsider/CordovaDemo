cordova.define("cordova-plugin-insider.Utils", function(require, exports, module) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
module.exports = {
  asyncExec: function asyncExec(className, reference) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return new Promise(function (resolve, reject) {
      window.cordova.exec(resolve, reject, className, reference, args);
    });
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
  }
};
});
