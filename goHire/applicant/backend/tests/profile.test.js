const request = require('supertest');
const app = require('../app');

describe('Profile API', () => {
    it('should require authentication to access /api/profile', async () => {
        const res = await request(app).get('/api/profile');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should require authentication to update /api/profile', async () => {
        const res = await request(app).put('/api/profile');
        expect([401, 403]).toContain(res.statusCode);
    });

    it('should require authentication to add education', async () => {
        const res = await request(app).post('/api/profile/education');
        expect([401, 403, 404]).toContain(res.statusCode);
    });
    
    it('should require authentication to add experience', async () => {
        const res = await request(app).post('/api/profile/experience');
        expect([401, 403, 404]).toContain(res.statusCode);
    });
});
