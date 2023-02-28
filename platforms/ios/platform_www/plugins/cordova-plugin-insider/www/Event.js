cordova.define("cordova-plugin-insider.Event", function(require, exports, module) {
"use strict";

const Utils = require("./Utils");
const InsiderConstants = require("./Constants");

class Event {
    name = '';
    parameters = {};

    constructor(name) {
        this.name = name;
    }

    addParameterWithString(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-addParameterWithString key or value'); return this;}

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithInt(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-addParameterWithInt key or value'); return this;}

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithDouble(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-addParameterWithDouble key or value'); return this;}

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithBoolean(key, value) {
        if (key === null || value === null || Utils.isEmpty(key)|| Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-addParameterWithBoolean key or value'); return this;}

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithDate(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-addParameterWithDate key or value'); return this;}

        try {

            this.parameters[key] = value.toISOString();

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithArray(key, value) {
        if (key === null || value === null || Utils.isEmpty(key) || Utils.isEmpty(value)){ Utils.showWarning(this.constructor.name + '-addParameterWithArray key or value'); return this;}

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    build() {
        try {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.TAG_EVENT, [this.name, this.parameters]);
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }
}

module.exports = Event;
});
