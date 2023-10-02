cordova.define("cordova-plugin-insider.Identifier", function(require, exports, module) {
"use strict";

const Utils = require("./Utils");
const InsiderConstants = require("./Constants");

class Identifier {
    identifiers = {};

    constructor() {
        this.identifiers = {};
    }

    addEmail(email) {
        if (Utils.checkParameters([{ type: 'string', value: email }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addEmail');
            return this;
        }

        try {
            this.identifiers[InsiderConstants.ADD_EMAIL] = email;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    addPhoneNumber(phoneNumber) {
        if (Utils.checkParameters([{ type: 'string', value: phoneNumber }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addPhoneNumber');
            return this;
        }

        try {
            this.identifiers[InsiderConstants.ADD_PHONE_NUMBER] = phoneNumber;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    addUserID(userID) {
        if (Utils.checkParameters([{ type: 'string', value: userID }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addUserID');
            return this;
        }

        try {
            this.identifiers[InsiderConstants.ADD_USER_ID] = userID;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    addCustomIdentifier(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'string', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addCustomIdentifier');
            return this;
        }

        try {
            this.identifiers[key] = value;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    getIdentifiers() {
        return this.identifiers;
    }
}

module.exports = Identifier;
});
