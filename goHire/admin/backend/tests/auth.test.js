const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should return 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should require authentication for current user endpoint', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401); // Or 403 depending on your auth middleware
  });
});