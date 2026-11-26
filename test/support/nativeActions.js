const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.resolve(__dirname, '../../plugins/cordova-plugin-insider');

const toConstantCase = (action) =>
  action
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toUpperCase();

function readStringConstants(javaSource) {
  const constants = new Map();
  for (const [, name, value] of javaSource.matchAll(/static\s+final\s+String\s+(\w+)\s*=\s*"([^"]*)"/g)) {
    constants.set(name, value);
  }
  return constants;
}

function androidActions() {
  const plugin = fs.readFileSync(path.join(PLUGIN_DIR, 'src/android/InsiderPlugin.java'), 'utf8');
  const constants = readStringConstants(fs.readFileSync(path.join(PLUGIN_DIR, 'src/android/Constants.java'), 'utf8'));
  const literals = new Set();
  const hybridMethodNames = new Set();

  for (const [, literal, owner, name] of plugin.matchAll(/action\.equals\(\s*(?:"([^"]+)"|(\w+)\.(\w+))\s*\)/g)) {
    if (literal) {
      literals.add(literal);
    } else if (owner === 'Constants' && constants.has(name)) {
      literals.add(constants.get(name));
    } else if (owner === 'InsiderHybridMethods') {
      hybridMethodNames.add(name);
    } else {
      throw new Error(`Unresolvable action reference ${owner}.${name} in InsiderPlugin.java`);
    }
  }

  return {
    literals,
    hybridMethodNames,
    // InsiderHybridMethods ships in the Android SDK artifact, so its values are matched by the SDK's naming convention.
    has: (action) => literals.has(action) || hybridMethodNames.has(toConstantCase(action)),
  };
}

function iosActions() {
  const plugin = fs.readFileSync(path.join(PLUGIN_DIR, 'src/ios/InsiderPlugin.m'), 'utf8');
  const selectors = new Set();
  for (const [, selector] of plugin.matchAll(/^-\s*\(void\)\s*(\w+)\s*:\s*\(CDVInvokedUrlCommand\s*\*\s*\)/gm)) {
    selectors.add(selector);
  }
  return { selectors, has: (action) => selectors.has(action) };
}

module.exports = { PLUGIN_DIR, toConstantCase, androidActions, iosActions };
