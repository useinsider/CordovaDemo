const { loadDemoPage, captureConsole, readWww } = require('./support/demoPage');
const { SPEC_TITLES } = require('./support/featureGapSuite');

const succeed = ({ action, args, success }) =>
  success(action.startsWith('getContent') ? args[1] : action === 'getAppCardsCampaigns' ? { items: [] } : undefined);

describe('home output console', () => {
  let page;
  let logs;

  const consoleText = () => document.getElementById('playgroundConsole').textContent;

  async function click(id) {
    page.handlerErrors.length = 0;
    document.getElementById(id).click();
    await page.settle();
  }

  beforeAll(async () => {
    logs = captureConsole();
    window.alert = jest.fn();
    page = loadDemoPage({ html: 'index.html', script: 'js/index.js', platformId: 'ios', respond: succeed });
    document.dispatchEvent(new Event('deviceready'));
    await page.settle();
  });

  afterAll(() => logs.restore());

  beforeEach(() => {
    page.bridge.respond = succeed;
  });

  test('init writes to the console', () => {
    expect(consoleText()).toContain('[INSIDER][initialize]: Method is triggered.');
  });

  test('a button writes its result line', async () => {
    await click('gdprTrue');
    expect(consoleText()).toContain('[INSIDER][setGDPRConsent]: true');
  });

  test('clear button empties the console', async () => {
    await click('clearConsole');
    expect(consoleText()).toBe('');
  });

  test('console keeps the newest 200 lines', () => {
    const logInsider = page.global('logInsider');
    for (let i = 0; i < 250; i += 1) logInsider('x', i);
    const lines = consoleText().split('\n');
    expect(lines).toHaveLength(200);
    expect(lines[0]).toBe('[INSIDER][x]: 50');
    expect(lines[199]).toBe('[INSIDER][x]: 249');
  });

  test('logInsiderError writes the error line', async () => {
    page.bridge.respond = ({ action, args, success, failure }) =>
      action === 'getSmartRecommendation' ? failure('denied') : succeed({ action, args, success });
    await click('smartRecommender');
    expect(consoleText()).toContain('[INSIDER][getSmartRecommendation] error: denied');
    expect(page.handlerErrors).toEqual([]);
  });

  test('a failing call in a multi-call handler is labelled with its own API and the rest still run', async () => {
    await click('clearConsole');
    page.execCalls.length = 0;
    page.bridge.respond = ({ action, args, success, failure }) =>
      action === 'getSmartRecommendationWithProduct' ? failure('boom') : success(action.startsWith('getSmart') ? {} : undefined);
    await click('smartRecommender');
    expect(consoleText()).toContain('[INSIDER][getSmartRecommendationWithProduct] error: boom');
    expect(consoleText()).not.toContain('[INSIDER][getSmartRecommendation] error');
    expect(page.execCalls.map((c) => c.action)).toContain('getSmartRecommendationWithProductIDs');
  });

  test('logInsiderError prints a plain-object error as JSON', async () => {
    page.bridge.respond = ({ action, args, success, failure }) =>
      action === 'getSmartRecommendation' ? failure({ code: 'E1' }) : succeed({ action, args, success });
    await click('smartRecommender');
    expect(consoleText()).toContain('[INSIDER][getSmartRecommendation] error: {"code":"E1"}');
  });

  test('logInsiderError prints the message of an App Cards bridge error', async () => {
    page.bridge.respond = ({ action, args, success, failure }) =>
      action === 'getAppCardsCampaigns'
        ? failure({ code: 'networkError', message: 'offline' })
        : succeed({ action, args, success });
    await click('appCards');
    expect(consoleText()).toContain('[INSIDER][getCampaigns] error: offline');
    expect(page.handlerErrors).toEqual([]);
  });

  test('notification callbacks write NOTIFICATION_OPEN and TEMP_STORE_CUSTOM_ACTION lines', () => {
    const { NOTIFICATION_OPEN, TEMP_STORE_CUSTOM_ACTION } = window.Insider.callbackType;
    const dispatch = (result) => {
      const event = new Event('ins_notification_handle');
      event.result = result;
      document.dispatchEvent(event);
    };
    dispatch({ type: NOTIFICATION_OPEN, url: 'demo://open' });
    dispatch({ type: TEMP_STORE_CUSTOM_ACTION, action: 'promo' });
    expect(consoleText()).toContain(`[INSIDER][NOTIFICATION_OPEN]: {"type":${NOTIFICATION_OPEN},"url":"demo://open"}`);
    expect(consoleText()).toContain(
      `[INSIDER][TEMP_STORE_CUSTOM_ACTION]: {"type":${TEMP_STORE_CUSTOM_ACTION},"action":"promo"}`,
    );
  });

  test('login writes the native Insider ID to the console', async () => {
    page.bridge.respond = ({ action, args, success }) =>
      action === 'login' ? success('insider-id-042') : succeed({ action, args, success });
    await click('login');
    expect(consoleText()).toContain('[INSIDER][login]: Insider ID: insider-id-042');
  });

  test('an unhandled rejection from a fire-and-forget call reaches the console', () => {
    const event = new Event('unhandledrejection');
    event.reason = 'native failure';
    window.dispatchEvent(event);
    expect(consoleText()).toContain('[INSIDER][unhandled] error: native failure');
  });

  test('console wraps long lines', () => {
    const [, rule] = readWww('css/index.css').match(/#playgroundConsole\s*{([^}]*)}/);
    expect(rule).toMatch(/white-space:\s*pre-wrap/);
    expect(rule).toMatch(/overflow-wrap:\s*anywhere/);
  });

  test('sections sit in the scroll container in spec order', () => {
    const titles = [...document.querySelectorAll('#playgroundSections h2.playground-title')].map((h) => h.textContent.trim());
    expect(titles).toEqual(SPEC_TITLES);
  });
});
