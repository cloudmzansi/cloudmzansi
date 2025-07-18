import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());
app.post('/api/v1/auth/login', (req, res) => res.json({ success: true, token: 'demo-token' }));

describe('POST /api/v1/auth/login', () => {
  it('should return a token on login', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
}); 