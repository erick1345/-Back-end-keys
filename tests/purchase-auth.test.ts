import request from 'supertest';
import { app } from '../src/app';
import { Database } from '../src/database/Database';
import { getAdminToken, getUserToken } from './helpers';

let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

function gamePayload() {
  const unique = Date.now();

  return {
    titulo: `Jogo Compra ${unique}`,
    descricao: 'Teste de compra',
    preco: 50,
    plataforma: 'PC',
    estoque: 5,
    imagem_url: 'https://teste.com/imagem.png',
  };
}

async function getNonExistingGameId() {
  const db = Database.getConnection();

  const [rows]: any = await db.execute(`
    SELECT COALESCE(MAX(id), 0) AS maxId
    FROM jogos
  `);

  return Number(rows[0].maxId) + 1000;
}

describe('Purchase', () => {
  it('deve falhar sem token', async () => {
    const res = await request(app)
      .post('/purchase')
      .send({ gameId: 1 });

    expect(res.status).toBe(401);
  });

  it('deve falhar sem gameId', async () => {
    const { token } = await getUserToken();

    const res = await request(app)
      .post('/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar erro para jogo inexistente', async () => {
    const { token } = await getUserToken();
    const nonExistingGameId = await getNonExistingGameId();

    const res = await request(app)
      .post('/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: nonExistingGameId });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('deve registrar compra com sucesso para jogo existente', async () => {
    const { token } = await getUserToken();
    const { token: adminToken } = await getAdminToken();

    const game = await request(app)
      .post('/jogos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(gamePayload());

    expect(game.status).toBe(201);
    expect(game.body).toHaveProperty('id');

    const gameId = game.body.id;

    const res = await request(app)
      .post('/purchase')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Compra registrada com sucesso');
  });
});