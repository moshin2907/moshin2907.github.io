const request = require('supertest');

describe('API Endpoints', () => {
  let app;
  let server;
  
  beforeAll(() => {
    // Import app after setting up the test environment
    app = require('../server');
  });
  
  afterAll(async () => {
    // Close any open handles
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  test('GET /api/health should return OK status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Frontend Logic', () => {
  test('greeting should be defined', () => {
    const { greeting } = require('../src/index.js');
    expect(greeting).toBe('Hello from CI/CD!');
  });
});