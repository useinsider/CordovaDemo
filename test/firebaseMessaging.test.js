const { loadDemoPage, captureConsole, flushPromises } = require('./support/demoPage');

describe('Firebase Messaging', () => {
  let logs;
  let page;

  const consoleText = () => document.getElementById('playgroundConsole').textContent;
  const deviceReady = async () => {
    document.dispatchEvent(new Event('deviceready'));
    for (let i = 0; i < 5; i += 1) await flushPromises();
  };

  beforeAll(async () => {
    logs = captureConsole();
    page = loadDemoPage({ html: 'index.html', script: 'js/index.js', platformId: 'ios', respond: ({ success }) => success() });
    await deviceReady();
  });

  afterAll(() => logs.restore());

  test('deviceready asks Firebase for the permission and the token instead of Insider', () => {
    expect(page.firebaseMessaging.requestPermission).toHaveBeenCalledWith({ forceShow: true });
    expect(page.execCalls.map((call) => call.action)).not.toContain('registerWithQuietPermission');
    expect(consoleText()).toContain('[FCM][requestPermission]: granted');
    expect(consoleText()).toContain('[FCM][getToken]: test-fcm-token');
  });

  test.each(['onMessage', 'onBackgroundMessage'])('%s forwards an Insider push to handleNotification', (listener) => {
    page.execCalls.length = 0;
    const payload = { source: 'Insider', camp_id: '1' };
    page.firebaseMessaging.listeners[listener].forEach((callback) => callback(payload));

    const forwarded = page.execCalls.filter((call) => call.action === 'handleNotification');
    expect(forwarded.map((call) => call.args)).toEqual([[payload]]);
    expect(consoleText()).toContain(`[FCM][${listener}]: ${JSON.stringify(payload)}`);
  });

  test.each(['onMessage', 'onBackgroundMessage'])('%s keeps a push from another sender out of Insider', (listener) => {
    page.execCalls.length = 0;
    page.firebaseMessaging.listeners[listener].forEach((callback) => callback({ source: 'Other' }));

    expect(page.execCalls.map((call) => call.action)).not.toContain('handleNotification');
  });

  test('a denied permission is written to the console', async () => {
    page.firebaseMessaging.requestPermission.mockReturnValueOnce(Promise.reject('Notifications permission is not granted'));
    await deviceReady();

    expect(consoleText()).toContain('[FCM][requestPermission]: Notifications permission is not granted');
  });
});
