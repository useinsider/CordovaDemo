const { loadDemoPage, captureConsole, readWww } = require('./demoPage');
const { androidActions, iosActions } = require('./nativeActions');

const BUTTON_IDS = [...readWww('index.html').matchAll(/<input[^>]*class="insider-button[^"]*"[^>]*id="([^"]+)"/g)].map(
  ([, id]) => id,
);

const NO_NATIVE_CALL = new Set(['createProduct', 'appCards']);

// iOS-only APIs the plugin JS still sends on Android; the Java side has no branch for them.
const PLATFORM_ONLY_ACTIONS = {
  android: new Set(['enableIDFACollection', 'setActiveForegroundPushView']),
  ios: new Set(),
};

const EXEC_RESULTS = {
  login: 'insider-id-000',
  logoutResettingInsiderID: 'insider-id-001',
  getAppCardsCampaigns: { items: [] },
  getMessageCenterData: [],
  getSmartRecommendation: {},
  getSmartRecommendationWithProductIDs: {},
};

function describeIndexPage(platformId) {
  const native = platformId === 'android' ? androidActions() : iosActions();
  const unimplemented = (actions) =>
    actions.filter((action) => !native.has(action) && !PLATFORM_ONLY_ACTIONS[platformId].has(action));

  describe(`index.html on ${platformId}`, () => {
    let page;
    let logs;

    beforeAll(async () => {
      logs = captureConsole();
      window.alert = jest.fn();
      page = loadDemoPage({
        html: 'index.html',
        script: 'js/index.js',
        platformId,
        respond: ({ action, args, success }) =>
          success(action in EXEC_RESULTS ? EXEC_RESULTS[action] : action.startsWith('getContent') ? args[1] : undefined),
      });
      document.dispatchEvent(new Event('deviceready'));
      await page.settle();
    });

    afterAll(() => logs.restore());

    async function click(id) {
      page.execCalls.length = 0;
      page.handlerErrors.length = 0;
      logs.reset();
      document.getElementById(id).click();
      await page.settle();
      return {
        actions: page.execCalls.map((call) => call.action),
        services: [...new Set(page.execCalls.map((call) => call.service))],
        failures: [...page.handlerErrors.map(String), ...logs.errors, ...logs.warnings],
      };
    }

    test('top-level app object is reachable', () => {
      expect(typeof page.global('app')).toBe('object');
      expect(typeof page.global('purchase').itemPurchase).toBe('function');
    });

    test('deviceready initialises the SDK through native actions that exist', () => {
      const actions = page.execCalls.map((call) => call.action);
      expect(actions).toContain(platformId === 'ios' ? 'initWithLaunchOptions' : 'init');
      expect(actions).toEqual(expect.arrayContaining(['registerWithQuietPermission', 'startTrackingGeofence']));
      expect(unimplemented(actions)).toEqual([]);
      expect([...page.handlerErrors, ...logs.errors, ...logs.warnings]).toEqual([]);
    });

    test('index.html has the expected buttons', () => {
      expect(BUTTON_IDS).toHaveLength(28);
      expect(new Set(BUTTON_IDS).size).toBe(BUTTON_IDS.length);
    });

    test.each(BUTTON_IDS)('#%s runs without errors and only calls implemented native actions', async (id) => {
      const result = await click(id);
      expect(result.failures).toEqual([]);
      if (!NO_NATIVE_CALL.has(id)) expect(result.actions.length).toBeGreaterThan(0);
      expect(result.services.filter((service) => service !== 'InsiderPlugin')).toEqual([]);
      expect(unimplemented(result.actions)).toEqual([]);
    });

    test('clickSmartRecommendationProduct sends the product before the recommendation ID', async () => {
      await click('clickSmartRecommendationProduct');
      const [call] = page.execCalls.filter((c) => c.action === 'clickSmartRecommendationProduct');
      expect(call.args[0]).toEqual(expect.objectContaining({ product_id: 'product1' }));
      expect(call.args[3]).toBe(1);
    });

    test('contentOptimizerNoCache reads all three variables without cache', async () => {
      const { actions } = await click('contentOptimizerNoCache');
      expect(actions).toEqual(['getContentIntWithoutCache', 'getContentStringWithoutCache', 'getContentBoolWithoutCache']);
    });

    test('login and logoutResettingInsiderID surface the native Insider ID', async () => {
      window.alert.mockClear();
      await click('login');
      await click('logoutResettingInsiderID');
      expect(window.alert).toHaveBeenCalledWith('insider-id-000');
      expect(window.alert).toHaveBeenCalledWith('Logout successful! New Insider ID: insider-id-001');
    });

    test('appCards saves the scroll position before navigating', async () => {
      sessionStorage.removeItem('homeScrollY');
      await click('appCards');
      expect(sessionStorage.getItem('homeScrollY')).toBe('0');
    });
  });
}

module.exports = { describeIndexPage, BUTTON_IDS };
