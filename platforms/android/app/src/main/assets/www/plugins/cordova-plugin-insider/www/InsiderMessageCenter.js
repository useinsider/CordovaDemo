cordova.define("cordova-plugin-insider.InsiderMessageCenter", function(require, exports, module) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var Utils = require('./Utils');
var Constants = require('./Constants');
var _require = require('./InsiderMessageCenterMessage'),
  InsiderMessageCenterInbox = _require.InsiderMessageCenterInbox,
  InsiderMessageCenterMessage = _require.InsiderMessageCenterMessage,
  InsiderMessageCenterMessageButton = _require.InsiderMessageCenterMessageButton;

/**
 * Main API for accessing and managing message center inbox functionality.
 *
 * @namespace InsiderMessageCenter
 */
var InsiderMessageCenter = Object.freeze({
  /**
   * Retrieves the user's message center inbox.
   *
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<InsiderMessageCenterInbox>|undefined}
   */
  getInbox: function getInbox(completion) {
    var promise = new Promise(function (resolve, reject) {
      Utils.asyncExec(Constants.CLASS, Constants.GET_MESSAGE_CENTER_INBOX, []).then(function (result) {
        resolve(new InsiderMessageCenterInbox(result));
      }).catch(function (error) {
        reject(new Error(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Marks specified messages as read in the message center.
   *
   * @param {string[]} messageIds - Message identifiers to mark as read.
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<void>|undefined}
   */
  markAsRead: function markAsRead(messageIds, completion) {
    var promise = new Promise(function (resolve, reject) {
      if (!Array.isArray(messageIds) || messageIds.length === 0 || messageIds.some(function (id) {
        return typeof id !== 'string';
      })) {
        reject(new Error('messageIds must be an array of strings'));
        return;
      }
      Utils.asyncExec(Constants.CLASS, Constants.MARK_MESSAGE_AS_READ, [messageIds]).then(function () {
        resolve();
      }).catch(function (error) {
        reject(new Error(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Marks specified messages as unread in the message center.
   *
   * @param {string[]} messageIds - Message identifiers to mark as unread.
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<void>|undefined}
   */
  markAsUnread: function markAsUnread(messageIds, completion) {
    var promise = new Promise(function (resolve, reject) {
      if (!Array.isArray(messageIds) || messageIds.length === 0 || messageIds.some(function (id) {
        return typeof id !== 'string';
      })) {
        reject(new Error('messageIds must be an array of strings'));
        return;
      }
      Utils.asyncExec(Constants.CLASS, Constants.MARK_MESSAGE_AS_UNREAD, [messageIds]).then(function () {
        resolve();
      }).catch(function (error) {
        reject(new Error(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Deletes specified messages from the message center.
   *
   * @param {string[]} messageIds - Message identifiers to delete.
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<void>|undefined}
   */
  deleteMessages: function deleteMessages(messageIds, completion) {
    var promise = new Promise(function (resolve, reject) {
      if (!Array.isArray(messageIds) || messageIds.length === 0 || messageIds.some(function (id) {
        return typeof id !== 'string';
      })) {
        reject(new Error('messageIds must be an array of strings'));
        return;
      }
      Utils.asyncExec(Constants.CLASS, Constants.DELETE_MESSAGE_CENTER_MESSAGES, [messageIds]).then(function () {
        resolve();
      }).catch(function (error) {
        reject(new Error(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Records a view event for a message.
   *
   * @param {Object} message - The message that was viewed.
   */
  viewMessage: function viewMessage(message) {
    if (!(message instanceof InsiderMessageCenterMessage)) {
      var _message$constructor;
      var receivedType = message === null ? 'null' : message === undefined ? 'undefined' : ((_message$constructor = message.constructor) === null || _message$constructor === void 0 ? void 0 : _message$constructor.name) || _typeof(message);
      throw new Error("message must be of type InsiderMessageCenterMessage, received: ".concat(receivedType));
    }
    Utils.asyncExec(Constants.CLASS, Constants.VIEW_MESSAGE_CENTER_MESSAGE, [JSON.stringify(message.data)]);
  },
  /**
   * Records a click event for a message.
   *
   * @param {Object} message - The message that was clicked.
   */
  clickMessage: function clickMessage(message) {
    if (!(message instanceof InsiderMessageCenterMessage)) {
      var _message$constructor2;
      var receivedType = message === null ? 'null' : message === undefined ? 'undefined' : ((_message$constructor2 = message.constructor) === null || _message$constructor2 === void 0 ? void 0 : _message$constructor2.name) || _typeof(message);
      throw new Error("message must be of type InsiderMessageCenterMessage, received: ".concat(receivedType));
    }
    Utils.asyncExec(Constants.CLASS, Constants.CLICK_MESSAGE_CENTER_MESSAGE, [JSON.stringify(message.data)]);
  },
  /**
   * Records a click event for a button within a message.
   *
   * @param {Object} button - The button that was clicked.
   */
  clickButton: function clickButton(button) {
    if (!(button instanceof InsiderMessageCenterMessageButton)) {
      var _button$constructor;
      var receivedType = button === null ? 'null' : button === undefined ? 'undefined' : ((_button$constructor = button.constructor) === null || _button$constructor === void 0 ? void 0 : _button$constructor.name) || _typeof(button);
      throw new Error("button must be of type InsiderMessageCenterMessageButton, received: ".concat(receivedType));
    }
    Utils.asyncExec(Constants.CLASS, Constants.CLICK_MESSAGE_CENTER_BUTTON, [button.messageId, JSON.stringify(button.data)]);
  }
});
module.exports = InsiderMessageCenter;
});
