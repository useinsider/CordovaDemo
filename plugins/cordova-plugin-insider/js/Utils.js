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
            switch (parameterConfig.type) {
                case "numeric_array":
                    if (!Array.isArray(parameterConfig.value)) {
                        return true;
                    }

                    return !parameterConfig.value.every(item => typeof item === "number");
                case "string_array":
                    if (!Array.isArray(parameterConfig.value)) {
                        return true;
                    }

                    return !parameterConfig.value.every(item => typeof item === "string");
                default:
                    return parameterConfig.type !== typeof parameterConfig.value;
            }
        });
    },
    showParameterWarningLog(functionName) {
        console.warn("[InsiderCordova] paramaters is not valid, function: " + functionName);
    }
};
