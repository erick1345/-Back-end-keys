import request from 'supertest';
import { app } from '../src/app';
import { Database } from '../src/database/Database';

export function uniqueEmail(prefix = 'teste'): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}@email.com`;
}

function calculateCpfDigit(base: number[]): number {
  const factor = base.length + 1;

  const total = base.reduce((sum, num, index) => {
    return sum + num * (factor - index);
  }, 0);

  const remainder = (total * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function uniqueCpf(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const digit1 = calculateCpfDigit(base);
  const digit2 = calculateCpfDigit([...base, digit1]);

  return [...base, digit1, digit2].join('');
}

export async function registerUser(overrides: Record<string, unknown> = {}) {
  const payload = {
    nome: 'Usuário Teste',
    email: uniqueEmail(),
    cpf: uniqueCpf(),
    senha: '12345678',
    ...overrides,
  };

  const response = await request(app).post('/register').send(payload);

  return { response, payload };
}

export async function getUserToken(overrides: Record<string, unknown> = {}) {
  const { response: registerResponse, payload } = await registerUser(overrides);

  expect(registerResponse.status).toBe(201);

  const login = await request(app)
    .post('/login')
    .send({
      email: payload.email,
      senha: payload.senha,
    });

  expect(login.status).toBe(200);
  expect(login.body).toHaveProperty('token');

  return {
    token: login.body.token as string,
    user: login.body.user,
    payload,
  };
}

export async function getAdminToken() {
  const { response: registerResponse, payload } = await registerUser({
    nome: 'Admin Teste',
    email: uniqueEmail('admin'),
    cpf: uniqueCpf(),
    senha: '12345678',
  });

  expect(registerResponse.status).toBe(201);

  const db = Database.getConnection();

  await db.execute(
    `
    UPDATE usuarios
    SET nivel_acesso = 'admin'
    WHERE email = ?
    `,
    [payload.email]
  );

  const login = await request(app)
    .post('/login')
    .send({
      email: payload.email,
      senha: payload.senha,
    });

  expect(login.status).toBe(200);
  expect(login.body).toHaveProperty('token');

  return {
    token: login.body.token as string,
    user: login.body.user,
    payload,
  };
}