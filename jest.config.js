module.exports = {
  resetMocks: true,
  restoreMocks: true,
  setupTestFrameworkScriptFile: '<rootDir>/modules/core/test/setup-tests.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>modules/**/test/**/*-test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
};
