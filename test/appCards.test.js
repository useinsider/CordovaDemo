const { loadDemoPage, captureConsole, flushPromises } = require('./support/demoPage');

const CARDS = [
  {
    id: 'card-1',
    type: 'carousel',
    read: false,
    content: { title: 'Title 1', description: 'Description 1' },
    images: [{ url: 'https://example.com/1.png' }, { url: '' }],
    buttons: [{ id: 'button-1', text: 'Open', action: { type: 'deep_link', url_scheme: 'demo://open' } }],
    action: { type: 'deep_link', url_scheme: 'demo://card', key_value: { campaign: 'spring' } },
  },
  { id: 'card-2', type: 'single', read: true, content: { title: 'Title 2' } },
];

const ERROR_LABELS = [
  ['sdkNotInitialized', 'SDK not initialized -'],
  ['invalidParameter', 'Invalid parameter -'],
  ['networkError', 'Network error -'],
  ['serverError', 'Server error -'],
  ['parseError', 'Parse error -'],
  ['unknown', 'Unknown error -'],
];

let page;
let logs;
let app;
let campaigns;
let failures;

const byId = (id) => document.getElementById(id);
const cardElement = (id) => document.querySelector(`[data-message-id="${id}"]`);
const actionsCalled = (action) => page.execCalls.filter((call) => call.action === action);

async function reload(items) {
  campaigns = { items };
  page.execCalls.length = 0;
  await app.loadMessages();
  page.execCalls.length = 0;
  logs.reset();
}

function touch(type, clientY, clientX = 0) {
  const event = new Event(type, { cancelable: true });
  Object.defineProperty(event, 'touches', { value: [{ clientX, clientY }] });
  document.dispatchEvent(event);
}

beforeAll(async () => {
  logs = captureConsole();
  failures = {};
  campaigns = { items: CARDS };
  page = loadDemoPage({
    html: 'app-cards.html',
    script: 'js/app-cards.js',
    platformId: 'android',
    respond: ({ action, success, failure }) => {
      if (failures[action]) return failure(failures[action]);
      return success(action === 'getAppCardsCampaigns' ? campaigns : undefined);
    },
  });
  app = page.global('app');
  document.dispatchEvent(new Event('deviceready'));
  await flushPromises();
});

afterAll(() => logs.restore());

beforeEach(() => {
  failures = {};
});

describe('rendering', () => {
  beforeEach(() => reload(CARDS));

  test('renders one element per app card', () => {
    expect(byId('messagesContainer').querySelectorAll('.message-item')).toHaveLength(2);
    expect(byId('loading').style.display).toBe('none');
    expect(byId('emptyState').style.display).toBe('none');
    expect(byId('deleteAllButton').style.display).toBe('block');
  });

  test('app card element reflects read state, content, images, type and buttons', () => {
    const unread = cardElement('card-1');
    expect(unread.className).toBe('message-item unread');
    expect(unread.querySelector('.message-status').textContent).toBe('UNREAD');
    expect(unread.querySelector('.message-title').textContent).toBe('Title 1');
    expect(unread.querySelector('.message-description').textContent).toBe('Description 1');
    expect([...unread.querySelectorAll('.message-image')].map((img) => img.src)).toEqual(['https://example.com/1.png']);
    expect(unread.querySelector('.message-type').textContent).toBe('Type: carousel');
    expect([...unread.querySelectorAll('.message-buttons-dynamic .message-button')].map((b) => b.textContent)).toEqual(['Open']);

    const read = cardElement('card-2');
    expect(read.className).toBe('message-item read');
    expect(read.querySelector('.message-status').textContent).toBe('READ');
    expect(read.querySelector('.message-description')).toBeNull();
    expect(read.querySelector('.message-images-container')).toBeNull();
    expect(read.querySelector('.message-buttons-dynamic')).toBeNull();
  });

  test('loading records a view for every rendered card', async () => {
    campaigns = { items: CARDS };
    await app.loadMessages();
    expect(actionsCalled('viewAppCard').map((call) => JSON.parse(call.args[0]).id)).toEqual(['card-1', 'card-2']);
  });

  test('Read and Unread buttons update the status after the native call succeeds', async () => {
    cardElement('card-1').querySelector('.message-button-read').click();
    await flushPromises();
    expect(actionsCalled('markAppCardAsRead')[0].args).toEqual([['card-1']]);
    expect(cardElement('card-1').className).toBe('message-item read');
    expect(cardElement('card-1').querySelector('.message-status').textContent).toBe('READ');

    cardElement('card-1').querySelector('.message-button-unread').click();
    await flushPromises();
    expect(actionsCalled('markAppCardAsUnread')[0].args).toEqual([['card-1']]);
    expect(cardElement('card-1').querySelector('.message-status').textContent).toBe('UNREAD');
  });

  test('a failed mark-as-read keeps the status and reports the error', async () => {
    failures.markAppCardAsRead = { code: 'serverError', message: 'boom' };
    cardElement('card-1').querySelector('.message-button-read').click();
    await flushPromises();
    expect(cardElement('card-1').querySelector('.message-status').textContent).toBe('UNREAD');
    expect(logs.errors).toEqual(['[INSIDER][APP_CARDS][MARK_AS_READ]: Server error - boom']);
  });

  test('card click logs the deep link key-value pairs', () => {
    console.log.mockClear();
    cardElement('card-1').click();
    expect(console.log).toHaveBeenCalledWith('[INSIDER][APP_CARDS][CARD_KEY_VALUES][card-1]:', { campaign: 'spring' });
  });

  test('card click and card button click record distinct clicks', () => {
    cardElement('card-1').click();
    expect(actionsCalled('clickAppCard').map((call) => JSON.parse(call.args[0]).id)).toEqual(['card-1']);

    page.execCalls.length = 0;
    cardElement('card-1').querySelector('.message-buttons-dynamic .message-button').click();
    expect(actionsCalled('clickAppCard')).toHaveLength(0);
    expect(actionsCalled('clickAppCardButton')[0].args[0]).toBe('card-1');
    expect(JSON.parse(actionsCalled('clickAppCardButton')[0].args[1]).id).toBe('button-1');
  });

  test('card button click logs the button key-value pairs as JSON', async () => {
    const keyValue = { coupon: 'SPRING10' };
    await reload([{ ...CARDS[0], buttons: [{ ...CARDS[0].buttons[0], action: { ...CARDS[0].buttons[0].action, key_value: keyValue } }] }]);
    console.log.mockClear();
    cardElement('card-1').querySelector('.message-buttons-dynamic .message-button').click();
    expect(console.log).toHaveBeenCalledWith('[INSIDER][APP_CARDS][BUTTON_KEY_VALUES][button-1]:', JSON.stringify(keyValue));
  });
});

describe('delete', () => {
  beforeEach(() => reload(CARDS));

  test('deleting one card removes only its element', async () => {
    cardElement('card-1').querySelector('.message-button-delete').click();
    await flushPromises();
    expect(actionsCalled('deleteAppCards')[0].args).toEqual([['card-1']]);
    expect(cardElement('card-1')).toBeNull();
    expect(cardElement('card-2')).not.toBeNull();
  });

  test('deleting every card one by one shows the empty state', async () => {
    for (const id of ['card-1', 'card-2']) {
      cardElement(id).querySelector('.message-button-delete').click();
      await flushPromises();
    }
    expect(byId('emptyState').style.display).toBe('block');
    expect(byId('deleteAllButton').style.display).toBe('none');
  });

  test('Delete All deletes every card and shows the empty state', async () => {
    byId('deleteAllButton').click();
    await flushPromises();
    expect(actionsCalled('deleteAppCards')[0].args).toEqual([['card-1', 'card-2']]);
    expect(byId('messagesContainer').children).toHaveLength(0);
    expect(byId('emptyState').style.display).toBe('block');
    expect(byId('deleteAllButton').style.display).toBe('none');
    expect(app.currentAppCards).toEqual([]);
  });

  test('Delete All after a single delete sends only the remaining card ids', async () => {
    cardElement('card-1').querySelector('.message-button-delete').click();
    await flushPromises();
    page.execCalls.length = 0;
    byId('deleteAllButton').click();
    await flushPromises();
    expect(actionsCalled('deleteAppCards')[0].args).toEqual([['card-2']]);
  });

  test('Delete All without cards makes no native call', async () => {
    app.currentAppCards = [];
    await app.deleteAllMessages();
    expect(actionsCalled('deleteAppCards')).toHaveLength(0);
  });
});

describe('loading states', () => {
  test('an empty campaign list shows the empty state', async () => {
    byId('deleteAllButton').style.display = 'none';
    await reload([]);
    expect(byId('emptyState').style.display).toBe('block');
    expect(byId('deleteAllButton').style.display).toBe('none');
    expect(byId('messagesContainer').children).toHaveLength(0);
  });

  test('a failed campaign fetch shows the error message', async () => {
    failures.getAppCardsCampaigns = { code: 'networkError', message: 'offline' };
    await app.loadMessages();
    expect(byId('loading').style.display).toBe('none');
    expect(byId('error').style.display).toBe('block');
    expect(byId('error').textContent).toBe('Error loading app cards: offline');
    expect(logs.errors).toEqual(['[INSIDER][APP_CARDS][GET_CAMPAIGNS]: Network error - offline']);
  });
});

describe('reload after a successful load', () => {
  beforeEach(() => reload(CARDS));

  test('a failed reload clears the previous cards so Delete All makes no native call', async () => {
    failures.getAppCardsCampaigns = { code: 'networkError', message: 'offline' };
    await app.loadMessages();
    expect(app.currentAppCards).toEqual([]);
    page.execCalls.length = 0;
    await app.deleteAllMessages();
    expect(actionsCalled('deleteAppCards')).toHaveLength(0);
  });

  test('an empty reload clears the previous cards so Delete All makes no native call', async () => {
    await reload([]);
    expect(app.currentAppCards).toEqual([]);
    await app.deleteAllMessages();
    expect(actionsCalled('deleteAppCards')).toHaveLength(0);
  });
});

describe('error code mapping', () => {
  beforeEach(() => logs.reset());

  test.each(ERROR_LABELS)('%s is logged as "%s"', (code, label) => {
    app.handleAppCardsError('OP', new window.Insider.AppCardsError(code, 'details'));
    expect(logs.errors).toEqual([`[INSIDER][APP_CARDS][OP]: ${label} details`]);
  });

  test('errors without a code are logged as-is', () => {
    app.handleAppCardsError('OP', 'plain failure');
    expect(logs.errors).toEqual(['[INSIDER][APP_CARDS][OP]: plain failure']);
  });
});

describe('pull to refresh', () => {
  const indicator = () => byId('ptrIndicator');
  const label = () => indicator().querySelector('.ptr-label').textContent;

  beforeEach(async () => {
    await reload(CARDS);
    app._resetPtr(false);
  });

  test('a pull below the threshold is not armed and snaps back without refreshing', () => {
    touch('touchstart', 100);
    touch('touchmove', 100 + 2 * (app.ptr.THRESHOLD - 10));
    expect(indicator().classList.contains('ptr-ready')).toBe(false);
    expect(label()).toBe('Pull to refresh');

    touch('touchend', 0);
    expect(indicator().style.height).toBe('0px');
    expect(actionsCalled('getAppCardsCampaigns')).toHaveLength(0);
  });

  test('a pull past the threshold arms, refreshes on release, then resets', async () => {
    touch('touchstart', 100);
    touch('touchmove', 100 + 2 * (app.ptr.THRESHOLD + 10));
    expect(indicator().classList.contains('ptr-ready')).toBe(true);
    expect(label()).toBe('Release to refresh');
    expect(indicator().style.height).toBe(`${app.ptr.THRESHOLD + 10}px`);

    touch('touchend', 0);
    expect(app.ptr.refreshing).toBe(true);
    expect(label()).toBe('Refreshing...');
    await flushPromises();
    expect(actionsCalled('getAppCardsCampaigns')).toHaveLength(1);
    expect(app.ptr.refreshing).toBe(false);
    expect(indicator().style.height).toBe('0px');
  });

  test('the pull distance is clamped to MAX_PULL', () => {
    touch('touchstart', 0);
    touch('touchmove', 10000);
    expect(indicator().style.height).toBe(`${app.ptr.MAX_PULL}px`);
    touch('touchcancel', 0);
    expect(indicator().style.height).toBe('0px');
  });

  test('a horizontal swipe abandons the pull', () => {
    touch('touchstart', 100, 0);
    touch('touchmove', 105, 60);
    expect(app.ptr.pulling).toBe(false);
    touch('touchmove', 400, 60);
    expect(indicator().classList.contains('ptr-ready')).toBe(false);
  });
});
