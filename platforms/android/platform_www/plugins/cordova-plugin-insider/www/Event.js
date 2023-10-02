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
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'string', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithString');
            return this;
        }

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithInt(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'number', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithInt');
            return this;
        }

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithDouble(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'number', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithDouble');
            return this;
        }

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithBoolean(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'boolean', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithBoolean');
            return this;
        }

        try {
            this.parameters[key] = value;

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithDate(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'object', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithDate');
            return this;
        }

        try {
            this.parameters[key] = value.toISOString();

            return this;
        } catch (error) {
            Utils.asyncExec(InsiderConstants.CLASS, InsiderConstants.PUT_ERROR_LOG, [Utils.generateJSONErrorString(error)]);
        }
    }

    addParameterWithArray(key, value) {
        if (Utils.checkParameters([{ type: 'string', value: key }, { type: 'object', value: value }])) {
            Utils.showParameterWarningLog(this.constructor.name + '-addParameterWithArray');
            return this;
        }

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
