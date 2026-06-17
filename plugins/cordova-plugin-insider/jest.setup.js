// Mock window.cordova for tests
global.window = {
  cordova: {
    exec: jest.fn((success, error, className, method, args) => {
      // Default mock implementation - can be overridden in tests
      if (success) {
        success('mock-success');
      }
    })
  }
};

// Mock console.warn to avoid noise in test output
global.console = {
  ...console,
  warn: jest.fn()
};
