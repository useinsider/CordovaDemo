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

const wwwFiles = (dir = WWW) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return wwwFiles(full);
    return /\.(css|html|js)$/.test(entry.name) ? [full] : [];
  });

// Colour literals in CSS declarations, style attributes and inline style assignments.
const COLOUR_LITERAL = /(?:[:\s(,]|^)(#[0-9a-f]{3,8}\b|rgba?\([^)]*\))/gim;

const colourSource = (file, text) => {
  if (file.endsWith('.css')) return text;
  if (file.endsWith('.html')) return [...text.matchAll(/style="([^"]*)"/g)].map(([, css]) => css).join('\n');
  return [...text.matchAll(/style\.\w+\s*=\s*(['"`])(.*?)\1/g)].map(([, , css]) => css).join('\n');
};

test('colour literals live only in tokens.css', () => {
  const offenders = wwwFiles()
    .filter((file) => path.basename(file) !== 'tokens.css')
    .flatMap((file) =>
      [...colourSource(file, fs.readFileSync(file, 'utf8')).matchAll(COLOUR_LITERAL)].map(
        ([, literal]) => `${path.relative(WWW, file)}: ${literal}`,
      ),
    );
  expect(offenders).toEqual([]);
});

test.each(['.mini-apps', '.mini-apps-backdrop'])('%s pins all four edges without relying on inset', (selector) => {
  const escaped = selector.replace('.', '\\.');
  const [, rule] = readWww('css/index.css').match(new RegExp(`${escaped}\\s*{([^}]*)}`));
  for (const side of ['top', 'right', 'bottom', 'left']) expect(rule).toMatch(new RegExp(`\\b${side}:\\s*0;`));
});

test('the console font lists Menlo before the generic monospace family', () => {
  expect(tokens()).toMatch(/--font-mono:\s*Menlo,\s*Courier,\s*monospace;/);
});

test('the logo is sized for its 26px slot', () => {
  const png = fs.readFileSync(path.join(WWW, 'img/insider-one.png'));
  expect(png.readUInt32BE(20)).toBeLessThanOrEqual(120);
});
