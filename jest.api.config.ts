import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'node',
  testTimeout: 20000,
  testPathIgnorePatterns: ['<rootDir>/__tests__/__lib__/'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/__lib__/api/jest.setup.js'],
  moduleNameMapper: {
    '^@/public/(.*)$': '<rootDir>/public/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/server/(.*)$': '<rootDir>/server/$1',
    '^@/common/(.*)$': '<rootDir>/common/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
