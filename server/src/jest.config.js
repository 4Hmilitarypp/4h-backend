module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '../tsconfig.json',
    },
  },
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/__tests__/**/*.(ts)'],
  testEnvironment: './jestSetup/mongoEnvironment.js',
  globalSetup: './jestSetup/setup.js',
  globalTeardown: './jestSetup/teardown.js',
  setupTestFrameworkScriptFile: './jestSetup/mongoose.js',
  verbose: false,

  coverageDirectory: '../coverage',
  coverageReporters: ['html'],
  collectCoverageFrom: ['**/*.ts', '!types.ts', '!sharedTypes.ts', '!models/*.ts', '!start.ts'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 50,
      functions: 80,
      lines: 85,
    },
  },
}
