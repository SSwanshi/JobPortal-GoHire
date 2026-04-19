const request = require('supertest');
const app = require('../app');

describe('Admin API', () => {
  it('should require authentication for premium users endpoint', async () => {
    const res = await request(app).get('/api/admin/premium-users');
    expect(res.statusCode).toEqual(401); 
  });
});