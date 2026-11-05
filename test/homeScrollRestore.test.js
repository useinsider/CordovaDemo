const { loadDemoPage, captureConsole } = require('./support/demoPage');

test('home restores the section scroll position', () => {
  const logs = captureConsole();
  sessionStorage.setItem('homeScrollY', '120');
  // jsdom does no layout, so record the value the page writes instead of relying on scrollTop.
  let restored;
  const nativeDescriptor = Object.getOwnPropertyDescriptor(window.Element.prototype, 'scrollTop');
  Object.defineProperty(window.Element.prototype, 'scrollTop', {
    configurable: true,
    get() {
      return 0;
    },
    set(value) {
      if (this.id === 'playgroundSections') restored = value;
    },
  });
  try {
    loadDemoPage({ html: 'index.html', script: 'js/index.js', platformId: 'ios', respond: ({ success }) => success() });
    expect(restored).toBe(120);
    expect(sessionStorage.getItem('homeScrollY')).toBeNull();
  } finally {
    Object.defineProperty(window.Element.prototype, 'scrollTop', nativeDescriptor);
    logs.restore();
  }
});
