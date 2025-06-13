module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/client', '<rootDir>/dist'],
  coverageDirectory: 'coverage',
};
