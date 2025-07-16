module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
      'src/**/*.js',
      'server.js',
      '!src/index.html'
    ],
    coverageReporters: ['text', 'lcov', 'html']
  };