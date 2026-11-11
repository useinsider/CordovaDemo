const { loadDemoPage, captureConsole, flushPromises } = require('./support/demoPage');

test('an init call that throws is written to the console instead of failing silently', async () => {
  const logs = captureConsole();
  try {
    loadDemoPage({ html: 'index.html', script: 'js/index.js', platformId: 'ios', respond: ({ success }) => success() });
    window.Insider.registerWithQuietPermission = () => {
      throw new Error('boom');
    };
    document.dispatchEvent(new Event('deviceready'));
    for (let i = 0; i < 5; i += 1) await flushPromises();
    const text = document.getElementById('playgroundConsole').textContent;
    expect(text).toContain('[INSIDER][initialize] error: boom');
    expect(text).not.toContain('[INSIDER][initialize]: Method is triggered.');
  } finally {
    logs.restore();
  }
});
