const request = require('supertest');
const app = require('../app');

describe('Intern Applicants API', () => {
  it('should require authentication to get internship applications', async () => {
    const res = await request(app).get('/api/internapplicants/12345');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to select an intern applicant', async () => {
    const res = await request(app).post('/api/internapplicants/12345/select/67890');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to reject an intern applicant', async () => {
    const res = await request(app).post('/api/internapplicants/12345/reject/67890');
    expect([401, 403]).toContain(res.statusCode);
  });
});
