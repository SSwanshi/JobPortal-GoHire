const request = require('supertest');
const app = require('../app');

describe('Jobs API', () => {
  it('should require authentication for jobs endpoint', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toEqual(401); 
  });
});