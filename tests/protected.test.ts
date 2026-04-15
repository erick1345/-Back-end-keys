import request from 'supertest';
import { app } from '../src/app';

describe('Rotas protegidas', () => {
  it('deve bloquear /dashboard/admin sem token', async () => {
    const response = await request(app).get('/dashboard/admin');

    expect(response.status).toBe(401);
  });

  it('deve bloquear /dashboard/sales sem token', async () => {
    const response = await request(app).get('/dashboard/sales');

    expect(response.status).toBe(401);
  });

  it('deve bloquear /purchase sem token', async () => {
    const response = await request(app).post('/purchase').send({
      gameId: 1,
    });

    expect(response.status).toBe(401);
  });
});