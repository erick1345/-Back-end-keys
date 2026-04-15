import request from 'supertest';
import { app } from '../src/app';
import { registerUser } from './helpers';

describe('Auth - Login', () => {
  it('deve retornar 400 se não enviar email e senha', async () => {
    const response = await request(app).post('/login').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('deve retornar 401 para usuário inexistente', async () => {
    const response = await request(app).post('/login').send({
      email: 'naoexiste@email.com',
      senha: '123456',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('deve retornar 401 para senha incorreta', async () => {
    const { response: registerResponse, payload } = await registerUser();

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/login').send({
      email: payload.email,
      senha: 'senha-errada',
    });

    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body).toHaveProperty('message');
  });

  it('deve logar com sucesso e retornar token', async () => {
    const { response: registerResponse, payload } = await registerUser();

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post('/login').send({
      email: payload.email,
      senha: payload.senha,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user.email).toBe(payload.email);
  });
});