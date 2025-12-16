module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*_test.ts'],
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage'
};