const { loadDemoPage, captureConsole } = require('./support/demoPage');

const CAMPAIGNS = { items: [{ id: 'c1', type: 'single', read: false, content: { title: 'T', description: 'D' } }] };

describe('mini-apps sheet and App Cards console button', () => {
  let page;
  let logs;

  const consoleText = () => document.getElementById('playgroundConsole').textContent;
  const sheet = () => document.getElementById('miniAppsSheet');

  async function click(id) {
    document.getElementById(id).click();
    await page.settle();
  }

  beforeAll(async () => {
    logs = captureConsole();
    page = loadDemoPage({
      html: 'index.html',
      script: 'js/index.js',
      platformId: 'ios',
      respond: ({ action, success }) => success(action === 'getAppCardsCampaigns' ? CAMPAIGNS : undefined),
    });
    document.dispatchEvent(new Event('deviceready'));
    await page.settle();
  });

  afterAll(() => logs.restore());

  test('Apps opens the sheet and the backdrop closes it', async () => {
    expect(sheet().hidden).toBe(true);
    await click('miniAppsButton');
    expect(sheet().hidden).toBe(false);
    await click('miniAppsBackdrop');
    expect(sheet().hidden).toBe(true);
  });

  test('Android back closes the open sheet', async () => {
    await click('miniAppsButton');
    expect(sheet().hidden).toBe(false);
    document.dispatchEvent(new Event('backbutton'));
    expect(sheet().hidden).toBe(true);
  });

  test('back is only intercepted while the sheet is open', async () => {
    const add = jest.spyOn(document, 'addEventListener');
    const remove = jest.spyOn(document, 'removeEventListener');
    try {
      await click('miniAppsButton');
      const added = add.mock.calls.filter(([type]) => type === 'backbutton');
      expect(added).toHaveLength(1);
      await click('miniAppsBackdrop');
      expect(remove.mock.calls.filter(([type]) => type === 'backbutton')).toEqual([added[0]]);
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });

  test('Escape closes the open sheet', async () => {
    await click('miniAppsButton');
    expect(sheet().hidden).toBe(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(sheet().hidden).toBe(true);
  });

  test('App Cards row saves the section scroll position and navigates', async () => {
    // jsdom does no layout and keeps scrollTop at 0, so stub it on the element.
    Object.defineProperty(document.getElementById('playgroundSections'), 'scrollTop', {
      value: 120,
      writable: true,
      configurable: true,
    });
    sessionStorage.removeItem('homeScrollY');
    await click('miniAppsButton');
    await click('miniAppAppCards');
    expect(sessionStorage.getItem('homeScrollY')).toBe('120');
    expect(consoleText()).toContain('[INSIDER][appCards]: Opening app cards page');
  });

  test('App Cards row closes the sheet', async () => {
    await click('miniAppsButton');
    expect(sheet().hidden).toBe(false);
    await click('miniAppAppCards');
    expect(sheet().hidden).toBe(true);
  });

  test('App Cards button logs campaigns', async () => {
    await click('appCards');
    expect(consoleText()).toContain('[INSIDER][getCampaigns]: Received 1 app cards');
    expect(consoleText()).toContain('  - Card ID: c1');
    expect(consoleText()).toContain('    Title: T');
    expect(consoleText()).toContain('    Description: D');
  });

  test('App Cards button logs the read state and image and button counts', async () => {
    const card = {
      id: 'c2',
      type: 'single',
      read: true,
      content: { title: 'T2' },
      images: [{ url: 'https://example.com/a.png' }, { url: 'https://example.com/b.png' }],
      buttons: [{ id: 'b1', text: 'Open' }, { id: 'b2', text: 'Later' }, { id: 'b3', text: 'Close' }],
    };
    page.bridge.respond = ({ action, success }) => success(action === 'getAppCardsCampaigns' ? { items: [card] } : undefined);
    await click('clearConsole');
    await click('appCards');
    const lines = consoleText().split('\n');
    const start = lines.indexOf('  - Card ID: c2');
    expect(start).toBeGreaterThan(-1);
    expect(lines.slice(start + 3, start + 6)).toEqual(['    Read: true', '    Images: 2', '    Buttons: 3']);
  });

  test('App Cards button keeps the count visible for a large inbox', async () => {
    const many = { items: Array.from({ length: 40 }, (_, i) => ({ id: `c${i}`, type: 'single', read: false, content: { title: 'T' } })) };
    page.bridge.respond = ({ action, success }) => success(action === 'getAppCardsCampaigns' ? many : undefined);
    await click('clearConsole');
    await click('appCards');
    const lines = consoleText().split('\n');
    expect(lines[lines.length - 1]).toBe('[INSIDER][getCampaigns]: Received 40 app cards');
  });

  test('App Cards button is labelled as in FlutterDemo', () => {
    expect(document.getElementById('appCards').value).toBe('Get Campaigns Data (Console)');
  });

  test('floating elements are body children', () => {
    expect(document.getElementById('miniAppsButton').parentElement).toBe(document.body);
    expect(sheet().parentElement).toBe(document.body);
  });
});
