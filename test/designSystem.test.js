const fs = require('fs');
const path = require('path');
const { WWW, readWww } = require('./support/demoPage');

const FLUTTER_COLOURS = {
  navy: '#1B1F3B',
  'navy-dark': '#0E1027',
  orange: '#FF5C35',
  surface: '#F7F8FC',
  'surface-variant': '#EDEFF7',
  'on-surface': '#1B1F3B',
  'on-surface-variant': '#5B6075',
  outline: '#D6DAE8',
  white: '#FFFFFF',
  'ios-canvas': '#EFEBE4',
  'ios-text-primary': '#18181B',
  'ios-accent': '#F4482B',
  'ios-gradient-red': '#E92E2F',
  'ios-gradient-orange': '#FF6126',
  'ios-border': '#18181B1F',
  'accent-inbox': '#F59E0B',
  'on-navy-variant': '#B9BED6',
  'navy-card-outline': '#FFFFFF26',
  'navy-chevron': '#FFFFFF80',
};

const tokens = () => readWww('css/tokens.css');

test.each(Object.entries(FLUTTER_COLOURS))('tokens.css declares --%s as %s', (name, value) => {
  expect(tokens().toLowerCase()).toContain(`--${name}: ${value.toLowerCase()};`);
});

test('Kufam is bundled in four weights with font-display swap', () => {
  const blocks = [...tokens().matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => body);
  expect(blocks).toHaveLength(4);
  const weights = blocks.map((body) => {
    expect(body).toMatch(/font-family:\s*'Kufam'/);
    expect(body).toMatch(/font-display:\s*swap/);
    const [, file] = body.match(/url\(['"]?\.\.\/fonts\/(Kufam-[A-Za-z]+\.ttf)['"]?\)/);
    expect(fs.existsSync(path.join(WWW, 'fonts', file))).toBe(true);
    return Number(body.match(/font-weight:\s*(\d+)/)[1]);
  });
  expect(weights.sort()).toEqual([400, 500, 600, 700]);
});

test.each(['index.html', 'app-cards.html'])('%s loads tokens.css before any other stylesheet', (page) => {
  const sheets = [...readWww(page).matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(([, href]) => href);
  expect(sheets[0]).toBe('css/tokens.css');
});
