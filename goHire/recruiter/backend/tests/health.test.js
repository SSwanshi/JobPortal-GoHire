const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

describe('Health Check API', () => {
  afterAll(async () => {
    // Wait for any pending connection and close it to prevent Jest open handle warnings
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should return a 200 OK status on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
  });
});