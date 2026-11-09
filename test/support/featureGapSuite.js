const { loadDemoPage, captureConsole } = require('./demoPage');

const SPEC_TITLES = [
  'User Attributes',
  'User Identifiers',
  'Event',
  'Product',
  'Purchase',
  'Smart Recommender',
  'Page Visit Methods',
  'GDPR',
  'Mobile App Access',
  'Message Center',
  'App Cards',
  'Content Optimizer',
  'Geofence',
  'In-App Messages',
  'Wishlist',
  'Reinit',
];

const BUTTON_ACTIONS = [
  ['addToWishlist', ['itemAddedToWishlist']],
  ['removeFromWishlist', ['itemRemovedFromWishlist']],
  ['clearWishlist', ['wishlistCleared']],
  ['visitWishlistPage', ['visitWishlistPage']],
  ['enableInApp', ['enableInAppMessages']],
  ['disableInApp', ['disableInAppMessages']],
  ['startTrackingGeofence', ['startTrackingGeofence']],
  ['reinitWithPartnerName', ['reinitWithPartnerName']],
];

function describeFeatureGap(platformId) {
  describe(`feature-gap buttons on ${platformId}`, () => {
    let page;
    let logs;

    const consoleText = () => document.getElementById('playgroundConsole').textContent;

    async function click(id) {
      page.execCalls.length = 0;
      document.getElementById(id).click();
      await page.settle();
      return page.execCalls;
    }

    beforeAll(async () => {
      logs = captureConsole();
      window.alert = jest.fn();
      page = loadDemoPage({
        html: 'index.html',
        script: 'js/index.js',
        platformId,
        respond: ({ action, success }) => success(action.startsWith('getSmartRecommendation') ? {} : undefined),
      });
      document.dispatchEvent(new Event('deviceready'));
      await page.settle();
    });

    afterAll(() => logs.restore());

    test.each(BUTTON_ACTIONS)('#%s sends %j', async (id, expected) => {
      const calls = await click(id);
      expect(calls.map((call) => call.action)).toEqual(expected);
    });

    test('smartRecommender calls the three recommendation APIs in order', async () => {
      const calls = await click('smartRecommender');
      expect(calls.map((call) => call.action)).toEqual([
        'getSmartRecommendation',
        'getSmartRecommendationWithProduct',
        'getSmartRecommendationWithProductIDs',
      ]);
    });

    test('triggerEvents sends the string array parameter, not the deprecated array one', async () => {
      const calls = await click('triggerEvents');
      const second = calls.find((call) => call.action === 'tagEvent' && call.args[0] === 'second_event');
      const keys = second.args[1].map((parameter) => parameter.key);
      expect(keys).toContain('string_array_parameter');
      expect(keys).not.toContain('array_parameter');
    });

    test('reinit uses the init partner name', async () => {
      const calls = await click('reinitWithPartnerName');
      expect(calls[0].args).toEqual(['your_partner_name']);
      expect(consoleText()).toContain('active partner: your_partner_name');
    });

    test('allowBackgroundLocationUpdates explains iOS-only on Android', async () => {
      const calls = await click('allowBackgroundLocationUpdates');
      if (platformId === 'android') {
        expect(calls).toEqual([]);
        expect(consoleText()).toContain('[INSIDER][setAllowsBackgroundLocationUpdates]: iOS only, no native call on Android');
      } else {
        expect(calls.map((call) => [call.action, call.args])).toEqual([['setAllowsBackgroundLocationUpdates', ['true']]]);
      }
    });

    test('sections are in spec order', () => {
      const titles = [...document.querySelectorAll('#playgroundSections h2.playground-title')].map((h) => h.textContent.trim());
      expect(titles).toEqual(SPEC_TITLES);
    });
  });
}

module.exports = { describeFeatureGap, SPEC_TITLES };
