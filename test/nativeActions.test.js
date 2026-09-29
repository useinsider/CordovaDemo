const fs = require('fs');
const path = require('path');
const { PLUGIN_DIR, toConstantCase, androidActions, iosActions } = require('./support/nativeActions');

describe('native action lookup', () => {
  test.each([
    ['tagEvent', 'TAG_EVENT'],
    ['itemAddedToCart', 'ITEM_ADDED_TO_CART'],
    ['setSMSOptin', 'SET_SMS_OPTIN'],
    ['setGDPRConsent', 'SET_GDPR_CONSENT'],
    ['setFacebookID', 'SET_FACEBOOK_ID'],
    ['addUserID', 'ADD_USER_ID'],
  ])('toConstantCase(%s) is %s', (action, expected) => {
    expect(toConstantCase(action)).toBe(expected);
  });

  test('Android lookup resolves literals, Constants.java and InsiderHybridMethods references', () => {
    const android = androidActions();
    expect(android.literals.size).toBeGreaterThan(30);
    expect(android.hybridMethodNames.size).toBeGreaterThan(30);
    expect(android.has('init')).toBe(true);
    expect(android.has('handleNotification')).toBe(true);
    expect(android.has('tagEvent')).toBe(true);
    expect(android.has('tagEvents')).toBe(false);
  });

  test('iOS lookup resolves CDVInvokedUrlCommand selectors only', () => {
    const ios = iosActions();
    expect(ios.selectors.size).toBeGreaterThan(50);
    expect(ios.has('initWithLaunchOptions')).toBe(true);
    expect(ios.has('tagEvent')).toBe(true);
    expect(ios.has('sendErrorResultWithString')).toBe(false);
  });

  test('both platforms register the service name the JS bridge calls', () => {
    const { CLASS } = require(path.join(PLUGIN_DIR, 'www/Constants.js'));
    const pluginXml = fs.readFileSync(path.join(PLUGIN_DIR, 'plugin.xml'), 'utf8');
    const features = [...pluginXml.matchAll(/<feature name="([^"]+)"/g)].map(([, name]) => name);
    expect(features).toEqual([CLASS, CLASS]);
  });
});
