module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
      }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  }