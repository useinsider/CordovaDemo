cordova.define("cordova-plugin-insider.Utils", function(require, exports, module) {
"use strict";

module.exports = {
    asyncExec: (className, reference, args = []) => {
        return new Promise((resolve, reject) => {
            window.cordova.exec(resolve, reject, className, reference, args);
        });
    },
    generateJSONErrorString: (error) => {
        return ('[JavaScript Error] ' + error);
    },
     isEmpty(str) {
        return (!str || str.length === 0 );
    },
    showWarning(name){
        console.log("[InsiderPlugin Warning] Value is null or empty: " + name);
    }
};
});
