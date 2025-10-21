import { FastifyInstance } from 'fastify';
import request from 'supertest';
import { server } from '../src/server';

describe('Auth endpoints', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = server;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login with valid credentials', async () => {
    const res = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
  });
});