const { loadDemoPage, captureConsole, readWww } = require('./support/demoPage');

const HOME_TITLES = [
  'User Attributes',
  'User Identifiers',
  'Event',
  'Product',
  'Purchase',
  'Smart Recommender',
  'Social Proof',
  'Page Visit Methods',
  'GDPR',
  'Mobile App Access',
  'Message Center',
  'App Cards',
  'Content Optimizer',
  'In-App Messages',
];

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

  test('console wraps long lines', () => {
    const [, rule] = readWww('css/index.css').match(/#playgroundConsole\s*{([^}]*)}/);
    expect(rule).toMatch(/white-space:\s*pre-wrap/);
    expect(rule).toMatch(/overflow-wrap:\s*anywhere/);
  });

  test('sections sit in the scroll container in spec order', () => {
    const titles = [...document.querySelectorAll('#playgroundSections h2.playground-title')].map((h) => h.textContent.trim());
    expect(titles).toEqual(HOME_TITLES);
  });
});
