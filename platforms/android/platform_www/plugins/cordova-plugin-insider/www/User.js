cordova.define("cordova-plugin-insider.User", function(require, exports, module) {
"use strict";

const Utils = require("./Utils");
const InsiderConstants = require("./Constants");

class User {
    constructor() {}

    setGender(gender) {
        if (Utils.checkParameters([{ type: 'number', value: gender }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setGender');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_GENDER, [gender]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setBirthday(birthday) {
        if (Utils.checkParameters([{ type: 'string', value: birthday }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setBirthday');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_BIRTDAY, [birthday.toISOString()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setName(name) {
        if (Utils.checkParameters([{ type: 'string', value: name }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setName');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_NAME, [name]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setSurname(surname) {
        if (Utils.checkParameters([{ type: 'string', value: surname }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setSurname');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_SURNAME, [surname]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setAge(age) {
        if (Utils.checkParameters([{ type: 'string', value: age }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setAge');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_AGE, [age]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }


    setEmail(email) {
        if (Utils.checkParameters([{ type: 'string', value: email }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setEmail');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_EMAIL, [email]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setPhoneNumber(phone) {
        if (Utils.checkParameters([{ type: 'string', value: phone }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setPhoneNumber');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_PHONE_NUMBER, [phone]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setLanguage(language) {
        if (Utils.checkParameters([{ type: 'string', value: language }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setLanguage');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LANGUAGE, [language]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setLocale(locale) {
        if (Utils.checkParameters([{ type: 'string', value: locale }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setLocale');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LOCALE, [locale]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setFacebookID(facebookID) {
        if (Utils.checkParameters([{ type: 'string', value: facebookID }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setFacebookID');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_FACEBOOK_ID, [facebookID]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setTwitterID(twitterID) {
        if (Utils.checkParameters([{ type: 'string', value: twitterID }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setTwitterID');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_TWITTER_ID, [twitterID]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setEmailOptin(emailOptIn) {
        if (Utils.checkParameters([{ type: 'boolean', value: emailOptIn }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setEmailOptin');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_EMAIL_OPTIN, [emailOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setSMSOptin(smsOptIn) {
        if (Utils.checkParameters([{ type: 'boolean', value: emailOptIn }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setSMSOptin');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_SMS_OPTIN, [smsOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setPushOptin(pushOptIn) {
        if (Utils.checkParameters([{ type: 'boolean', value: pushOptIn }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setPushOptin');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_PUSH_OPTIN, [pushOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setLocationOptin(locationOptIn) {
        if (Utils.checkParameters([{ type: 'boolean', value: locationOptIn }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setLocationOptin');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LOCATION_OPTIN, [locationOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setWhatsappOptin(whatsappOptin) {
        if (Utils.checkParameters([{ type: 'boolean', value: whatsappOptin }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setWhatsappOptin');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_WHATSAPP_OPTIN, [whatsappOptin]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    login(identifiers, insiderIDResult) {
        try {
            if (!Utils.checkParameters([{ type: 'function', value: insiderIDResult }, { type: 'object', value: identifiers }])) {
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGIN, [identifiers, insiderIDResult]).then(id => insiderIDResult(id));
            } else if (!Utils.checkParameters([{ type: 'object', value: identifiers }])) {
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGIN, [identifiers]);
            } else {
                Utils.showParameterWarningLog(this.constructor.name + '-login');
            }
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    logout() {
        try {
            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGOUT, []);
        } catch (error) {
            Utils.asyncExec(InsiderCordovaPlugin, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    setCustomAttributeWithString(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'string', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithString');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_STRING, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithInt(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'number', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithInt');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_INT, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithDouble(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'number', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithDouble');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_DOUBLE, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithBoolean(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'boolean', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithBoolean');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_BOOLEAN, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithDate(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'object', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithDate');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_DATE, [key, value.toISOString()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithArray(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'object', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-setCustomAttributeWithArray');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_ARRAY, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    unsetCustomAttribute(key) {
        if (Utils.checkParameters([{ type: 'string', value: key }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-unsetCustomAttribute');
            return this;
        }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.UNSET_CUSTOM_ATTRIBUTE, [key]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }
}

module.exports = User;
});
