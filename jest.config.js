module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'json'],
  testMatch: [
    '**/*.spec.(js|ts)|**/__tests__/*.(js|ts)|**/__mocks__/*.(js|ts)',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!vuetify)' + 'node_modules/(?!ramda)'],
}
