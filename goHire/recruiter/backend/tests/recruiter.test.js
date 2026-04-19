const request = require('supertest');
const app = require('../app');

describe('Recruiter API', () => {
  it('should require authentication to get companies', async () => {
    const res = await request(app).get('/api/recruiter/companies');
    // Assuming auth middleware returns 401 or 403
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to add a company', async () => {
    const res = await request(app).post('/api/recruiter/add-company');
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should require authentication to get jobs', async () => {
    const res = await request(app).get('/api/recruiter/jobs');
    expect([401, 403]).toContain(res.statusCode);
  });
  
  it('should require authentication to get internships', async () => {
    const res = await request(app).get('/api/recruiter/internships');
    expect([401, 403]).toContain(res.statusCode);
  });
});
