const request = require('supertest');
const app = require('../app');

describe('Health Check API', () => {
  it('should return a 200 OK status on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
  });
});