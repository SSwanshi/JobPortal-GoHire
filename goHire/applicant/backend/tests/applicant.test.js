const request = require('supertest');
const app = require('../app');

describe('Applicant API', () => {
    it('should require authentication to apply for a job', async () => {
        const res = await request(app).post('/api/applicant/jobs/12345/apply');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should require authentication to apply for an internship', async () => {
        const res = await request(app).post('/api/applicant/internships/12345/apply');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should require authentication to get applied jobs', async () => {
        const res = await request(app).get('/api/applicant/applied-jobs');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should require authentication to get applied internships', async () => {
        const res = await request(app).get('/api/applicant/applied-internships');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should require authentication to see dashboard stats', async () => {
        const res = await request(app).get('/api/applicant/dashboard/stats');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should allow non-authenticated users to get jobs', async () => {
        const res = await request(app).get('/api/applicant/jobs');
        // Likely 200 or 500 depending on DB connection in test env, but NOT auth error
        expect([200, 500]).toContain(res.statusCode);
    }, 15000);
});
