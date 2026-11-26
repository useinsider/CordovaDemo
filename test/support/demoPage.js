const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const WWW = path.join(ROOT, 'www');
const PLUGIN_ENTRY = path.join(ROOT, 'plugins/cordova-plugin-insider/www/InsiderPlugin.js');
// jsdom cannot navigate; index.js sets location.href to open the App Cards page.
const JSDOM_NAVIGATION = 'Not implemented: navigation';

const readWww = (relativePath) => fs.readFileSync(path.join(WWW, relativePath), 'utf8');

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// Loads a www page with the real plugin JS; only the native bridge (cordova.exec) is faked.
function loadDemoPage({ html, script, platformId, respond }) {
  const execCalls = [];
  const bridge = { respond };
  window.cordova = {
    platformId,
    exec: jest.fn((success, failure, service, action, args) => {
      execCalls.push({ service, action, args });
      bridge.respond({ action, args, success, failure });
    }),
  };
  window.Insider = require(PLUGIN_ENTRY);

  const handlerErrors = [];
  const pending = [];
  // Collect click-handler rejections so each click can be awaited and attributed.
  const nativeAdd = window.HTMLElement.prototype.addEventListener;
  window.HTMLElement.prototype.addEventListener = function (type, listener, options) {
    if (type !== 'click' || typeof listener !== 'function') {
      return nativeAdd.call(this, type, listener, options);
    }
    const wrapped = function (...eventArgs) {
      try {
        const result = listener.apply(this, eventArgs);
        if (result && typeof result.then === 'function') {
          pending.push(result.catch((error) => handlerErrors.push(error)));
        }
        return result;
      } catch (error) {
        handlerErrors.push(error);
        return undefined;
      }
    };
    return nativeAdd.call(this, type, wrapped, options);
  };

  const parsed = new window.DOMParser().parseFromString(readWww(html), 'text/html');
  document.documentElement.innerHTML = parsed.documentElement.innerHTML;

  const scriptElement = document.createElement('script');
  scriptElement.textContent = readWww(script);
  document.body.appendChild(scriptElement);

  async function settle() {
    while (pending.length) {
      await Promise.all(pending.splice(0));
    }
    await flushPromises();
  }

  return {
    bridge,
    execCalls,
    handlerErrors,
    settle,
    global: (name) => window.eval(name),
  };
}

function captureConsole() {
  const errors = [];
  const warnings = [];
  const errorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
    const text = args.map((arg) => (arg instanceof Error ? arg.message : String(arg))).join(' ');
    if (!text.includes(JSDOM_NAVIGATION)) errors.push(text);
  });
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => warnings.push(args.join(' ')));
  jest.spyOn(console, 'log').mockImplementation(() => {});
  return {
    errors,
    warnings,
    reset: () => {
      errors.length = 0;
      warnings.length = 0;
    },
    restore: () => {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    },
  };
}

module.exports = { ROOT, WWW, readWww, flushPromises, loadDemoPage, captureConsole };
