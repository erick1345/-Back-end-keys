import request from 'supertest';
import { app } from '../src/app';
import { registerUser, uniqueCpf, uniqueEmail } from './helpers';

describe('User - Register', () => {
  it('deve falhar se faltar campos obrigatórios', async () => {
    const response = await request(app).post('/register').send({
      email: 'teste@email.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('deve criar usuário com dados válidos', async () => {
    const { response, payload } = await registerUser();

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(payload.email).toContain('@email.com');
  });

  it('deve impedir cadastro com email duplicado', async () => {
    const email = uniqueEmail('duplicado');

    const first = await request(app).post('/register').send({
      nome: 'Primeiro',
      email,
      cpf: uniqueCpf(),
      senha: '12345678',
    });

    expect(first.status).toBe(201);

    const second = await request(app).post('/register').send({
      nome: 'Segundo',
      email,
      cpf: uniqueCpf(),
      senha: '12345678',
    });

    expect(second.status).toBe(400);
    expect(second.body).toHaveProperty('message');
  });
});