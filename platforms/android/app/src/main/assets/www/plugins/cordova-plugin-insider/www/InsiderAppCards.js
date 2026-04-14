cordova.define("cordova-plugin-insider.InsiderAppCards", function(require, exports, module) {
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var Utils = require('./Utils');
var Constants = require('./Constants');
var _require = require('./InsiderAppCard'),
  InsiderAppCardsCampaignResponse = _require.InsiderAppCardsCampaignResponse,
  InsiderAppCard = _require.InsiderAppCard,
  InsiderAppCardButton = _require.InsiderAppCardButton;
var _require2 = require('./InsiderAppCardsError'),
  InsiderAppCardsError = _require2.InsiderAppCardsError,
  InsiderAppCardsErrorCode = _require2.InsiderAppCardsErrorCode;

/**
 * Main API for accessing and managing app cards functionality.
 *
 * @namespace InsiderAppCards
 */
var InsiderAppCards = Object.freeze({
  /**
   * Retrieves the user's app cards campaigns.
   *
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<InsiderAppCardsCampaignResponse>|undefined}
   */
  getCampaigns: function getCampaigns(completion) {
    var promise = new Promise(function (resolve, reject) {
      Utils.asyncExec(Constants.CLASS, Constants.GET_APP_CARDS_CAMPAIGNS, []).then(function (result) {
        resolve(new InsiderAppCardsCampaignResponse(result));
      }).catch(function (error) {
        reject(InsiderAppCardsError.from(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Marks specified app cards as read.
   *
   * @param {string[]} appCardIds - App card identifiers to mark as read.
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<void>|undefined}
   */
  markAsRead: function markAsRead(appCardIds, completion) {
    var promise = new Promise(function (resolve, reject) {
      if (!Array.isArray(appCardIds) || appCardIds.length === 0 || appCardIds.some(function (id) {
        return typeof id !== 'string';
      })) {
        reject(new InsiderAppCardsError(InsiderAppCardsErrorCode.INVALID_PARAMETER, 'appCardIds must be a non-empty array of strings.'));
        return;
      }
      Utils.asyncExec(Constants.CLASS, Constants.MARK_APP_CARD_AS_READ, [appCardIds]).then(function () {
        resolve();
      }).catch(function (error) {
        reject(InsiderAppCardsError.from(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Marks specified app cards as unread.
   *
   * @param {string[]} appCardIds - App card identifiers to mark as unread.
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<void>|undefined}
   */
  markAsUnread: function markAsUnread(appCardIds, completion) {
    var promise = new Promise(function (resolve, reject) {
      if (!Array.isArray(appCardIds) || appCardIds.length === 0 || appCardIds.some(function (id) {
        return typeof id !== 'string';
      })) {
        reject(new InsiderAppCardsError(InsiderAppCardsErrorCode.INVALID_PARAMETER, 'appCardIds must be a non-empty array of strings.'));
        return;
      }
      Utils.asyncExec(Constants.CLASS, Constants.MARK_APP_CARD_AS_UNREAD, [appCardIds]).then(function () {
        resolve();
      }).catch(function (error) {
        reject(InsiderAppCardsError.from(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  },
  /**
   * Records a view event for an app card.
   *
   * @param {Object} appCard - The app card that was viewed.
   */
  view: function view(appCard) {
    if (!(appCard instanceof InsiderAppCard)) {
      var _appCard$constructor;
      var receivedType = appCard === null ? 'null' : appCard === undefined ? 'undefined' : ((_appCard$constructor = appCard.constructor) === null || _appCard$constructor === void 0 ? void 0 : _appCard$constructor.name) || _typeof(appCard);
      throw new Error("appCard must be of type InsiderAppCard, received: ".concat(receivedType));
    }
    Utils.asyncExec(Constants.CLASS, Constants.VIEW_APP_CARD, [JSON.stringify(appCard.data)]);
  },
  /**
   * Records a click event for an app card.
   *
   * @param {Object} appCard - The app card that was clicked.
   */
  click: function click(appCard) {
    if (!(appCard instanceof InsiderAppCard)) {
      var _appCard$constructor2;
      var receivedType = appCard === null ? 'null' : appCard === undefined ? 'undefined' : ((_appCard$constructor2 = appCard.constructor) === null || _appCard$constructor2 === void 0 ? void 0 : _appCard$constructor2.name) || _typeof(appCard);
      throw new Error("appCard must be of type InsiderAppCard, received: ".concat(receivedType));
    }
    Utils.asyncExec(Constants.CLASS, Constants.CLICK_APP_CARD, [JSON.stringify(appCard.data)]);
  },
  /**
   * Records a click event for a button within an app card.
   *
   * @param {Object} button - The button that was clicked.
   */
  clickButton: function clickButton(button) {
    if (!(button instanceof InsiderAppCardButton)) {
      var _button$constructor;
      var receivedType = button === null ? 'null' : button === undefined ? 'undefined' : ((_button$constructor = button.constructor) === null || _button$constructor === void 0 ? void 0 : _button$constructor.name) || _typeof(button);
      throw new Error("button must be of type InsiderAppCardButton, received: ".concat(receivedType));
    }
    Utils.asyncExec(Constants.CLASS, Constants.CLICK_APP_CARD_BUTTON, [button.appCardId, JSON.stringify(button.data)]);
  },
  /**
   * Deletes specified app cards.
   *
   * @param {string[]} appCardIds - App card identifiers to delete.
   * @param {Function} [completion] - Completion handler.
   * @returns {Promise<void>|undefined}
   */
  delete: function _delete(appCardIds, completion) {
    var promise = new Promise(function (resolve, reject) {
      if (!Array.isArray(appCardIds) || appCardIds.length === 0 || appCardIds.some(function (id) {
        return typeof id !== 'string';
      })) {
        reject(new InsiderAppCardsError(InsiderAppCardsErrorCode.INVALID_PARAMETER, 'appCardIds must be a non-empty array of strings.'));
        return;
      }
      Utils.asyncExec(Constants.CLASS, Constants.DELETE_APP_CARDS, [appCardIds]).then(function () {
        resolve();
      }).catch(function (error) {
        reject(InsiderAppCardsError.from(error));
      });
    });
    return Utils.resolveWithCallback(promise, completion);
  }
});
module.exports = InsiderAppCards;
});
