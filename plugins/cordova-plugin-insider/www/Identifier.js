"use strict";

const Utils = require("./Utils");
const InsiderConstants = require("./Constants");

class Identifier {
    identifiers = {};

    constructor() {
        this.identifiers = {};
    }

    addEmail(email) {
        if (email === null || Utils.isEmpty(email)){ Utils.showWarning(this.constructor.name + '-email'); return this;}

        try {
            this.identifiers[InsiderConstants.ADD_EMAIL] = email;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    addPhoneNumber(phoneNumber) {
        if (phoneNumber === null || Utils.isEmpty(phoneNumber)){ Utils.showWarning(this.constructor.name + '-phoneNumber'); return this;}

        try {
            this.identifiers[InsiderConstants.ADD_PHONE_NUMBER] = phoneNumber;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    addUserID(userID) {
        if (userID === null || Utils.isEmpty(userID)){ Utils.showWarning(this.constructor.name + '-userID'); return this;}

        try {
            this.identifiers[InsiderConstants.ADD_USER_ID] = userID;
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    addCustomIdentifier(key, value) {
        if (key === null || value === null || Utils.isEmpty(key)){ Utils.showWarning(this.constructor.name + '-addCustomIdentifier key or value'); return this;}

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