const request = require('supertest');
const app = require('../app');

describe('Applications API', () => {
  it('should require authentication to get job applications', async () => {
    const res = await request(app).get('/api/applications/12345');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to select an applicant', async () => {
    const res = await request(app).post('/api/applications/12345/select/67890');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to reject an applicant', async () => {
    const res = await request(app).post('/api/applications/12345/reject/67890');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to get applicant resume', async () => {
    const res = await request(app).get('/api/applications/12345/resume/abcde');
    expect([401, 403]).toContain(res.statusCode);
  });
});
