import request from 'supertest';
import express from 'express';

const app = express();
app.get('/api/v1/users', (req, res) => res.json({ success: true, data: [] }));

describe('GET /api/v1/users', () => {
  it('should return a list of users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
}); 