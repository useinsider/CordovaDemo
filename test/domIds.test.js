const { readWww } = require('./support/demoPage');

const PAGES = [
  ['index.html', 'js/index.js'],
  ['app-cards.html', 'js/app-cards.js'],
];

const idsInHtml = (html) =>
  new Set([...new DOMParser().parseFromString(readWww(html), 'text/html').querySelectorAll('[id]')].map((el) => el.id));

const idsLookedUp = (script) => [...readWww(script).matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)].map(([, id]) => id);

describe.each(PAGES)('%s', (html, script) => {
  test(`every getElementById target in ${script} exists`, () => {
    const lookedUp = idsLookedUp(script);
    expect(lookedUp.length).toBeGreaterThan(0);
    const present = idsInHtml(html);
    expect(lookedUp.filter((id) => !present.has(id))).toEqual([]);
  });
});

test('every index.html button is wired in js/index.js', () => {
  const buttons = new DOMParser().parseFromString(readWww('index.html'), 'text/html').querySelectorAll('.insider-button[id]');
  const wired = new Set(idsLookedUp('js/index.js'));
  expect([...buttons].map((button) => button.id).filter((id) => !wired.has(id))).toEqual([]);
});
