const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should require authentication for checking session', async () => {
    const res = await request(app).get('/api/auth/check-session');
    // Depending on what your requireAuth middleware returns (usually 401 or 403)
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication for accessing profile', async () => {
     const res = await request(app).get('/api/auth/user/profile');
     expect([401, 403]).toContain(res.statusCode);
  });
});
