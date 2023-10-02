"use strict";

module.exports = {
    asyncExec: (className, reference, args = []) => {
        return new Promise((resolve, reject) => {
            window.cordova.exec(resolve, reject, className, reference, args);
        });
    },
    generateJSONErrorString: (error) => {
        return ('[InsiderCordova][JavaScriptError] ' + error);
    },
    checkParameters(parameters) {
        return parameters.some((parameterConfig) => {
            return parameterConfig.type !== typeof parameterConfig.value;
        });
    },
    showParameterWarningLog(functionName) {
        console.warn("[InsiderCordova] paramaters is not valid, function: " + functionName);
    }
};