cordova.define("cordova-plugin-insider.User", function(require, exports, module) {
"use strict";

const Utils = require("./Utils");
const InsiderConstants = require("./Constants");

class User {
    constructor() {}

    setGender(gender) {
        if (gender === null || Utils.isEmpty(gender)){ Utils.showWarning(this.constructor.name + '-gender'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_GENDER, [gender]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setBirthday(birthday) {
        if (birthday === null || Utils.isEmpty(birthday)){ Utils.showWarning(this.constructor.name + '-birthday'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_BIRTDAY, [birthday.toISOString()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setName(name) {
        if (name === null || Utils.isEmpty(name)){ Utils.showWarning(this.constructor.name + '-name'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_NAME, [name]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setSurname(surname) {
        if (surname === null || Utils.isEmpty(surname)){ Utils.showWarning(this.constructor.name + '-surname'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_SURNAME, [surname]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setAge(age) {
        if (age === null || Utils.isEmpty(age)){ Utils.showWarning(this.constructor.name + '-age'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_AGE, [age]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }


    setEmail(email) {
        if (email === null || Utils.isEmpty(email)){ Utils.showWarning(this.constructor.name + '-email'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_EMAIL, [email]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setPhoneNumber(phone) {
        if (phone === null || Utils.isEmpty(phone)){ Utils.showWarning(this.constructor.name + '-phone'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_PHONE_NUMBER, [phone]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setLanguage(language) {
        if (language === null || Utils.isEmpty(language)){ Utils.showWarning(this.constructor.name + '-language'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LANGUAGE, [language]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setLocale(locale) {
        if (locale === null || Utils.isEmpty(locale)){ Utils.showWarning(this.constructor.name + '-locale'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LOCALE, [locale]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setFacebookID(facebookID) {
        if (facebookID === null || Utils.isEmpty(facebookID)){ Utils.showWarning(this.constructor.name + '-facebookID'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_FACEBOOK_ID, [facebookID]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setTwitterID(twitterID) {
        if (twitterID === null || Utils.isEmpty(twitterID)){ Utils.showWarning(this.constructor.name + '-twitterID'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_TWITTER_ID, [twitterID]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setEmailOptin(emailOptIn) {
        if (emailOptIn === null || Utils.isEmpty(emailOptIn)){ Utils.showWarning(this.constructor.name + '-emailOptIn'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_EMAIL_OPTIN, [emailOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setSMSOptin(smsOptIn) {
        if (smsOptIn === null || Utils.isEmpty(smsOptIn)){ Utils.showWarning(this.constructor.name + '-smsOptIn'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_SMS_OPTIN, [smsOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
        return this;
    }

    setPushOptin(pushOptIn) {
        if (pushOptIn === null || Utils.isEmpty(pushOptIn)){ Utils.showWarning(this.constructor.name + '-pushOptIn'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_PUSH_OPTIN, [pushOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setLocationOptin(locationOptIn) {
        if (locationOptIn === null || locationOptIn == undefined) { Utils.showWarning(this.constructor.name + '-locationOptIn'); return this; }

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_LOCATION_OPTIN, [!!locationOptIn]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setWhatsappOptin(whatsappOptin) {
        if (whatsappOptin === null || Utils.isEmpty(whatsappOptin)){ Utils.showWarning(this.constructor.name + '-whatsappOptin'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_WHATSAPP_OPTIN, [whatsappOptin]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    login(identifiers, insiderIDResult) {
        try {
            if (insiderIDResult !== null) {
                Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGIN, [identifiers, insiderIDResult]).then(id => insiderIDResult(id));
            }

            return Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.LOGIN, [identifiers]);
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
        if (key == null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithString key or value'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_STRING, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithInt(key, value) {
        if (key == null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithInt key or value'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_INT, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithDouble(key, value) {
        if (key == null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithDouble key or value'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_DOUBLE, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithBoolean(key, value) {
        if (key == null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithBoolean key or value'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_BOOLEAN, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithDate(key, value) {
        if (key == null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithDate key or value'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_DATE, [key, value.toISOString()]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    setCustomAttributeWithArray(key, value) {
        if (key == null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-setCustomAttributeWithArray key or value'); return this;}

        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.SET_CUSTOM_ATTRIBUTE_WITH_ARRAY, [key, value]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }

        return this;
    }

    unsetCustomAttribute(key) {
        if (key == null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-unsetCustomAttribute key'); return this;}
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
