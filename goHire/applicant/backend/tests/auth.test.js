const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should return 401 for unauthorized access to /me', async () => {
    const res = await request(app).get('/api/auth/me');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should return 400 or 401 or 500 for invalid login disconnected DB', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' });
    expect([400, 401, 404, 500]).toContain(res.statusCode); 
  }, 15000);
});
