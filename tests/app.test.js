const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
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