import request from 'supertest';
import { app } from '../src/app';
import { getAdminToken } from './helpers';

function gamePayload() {
  const unique = Date.now();

  return {
    titulo: `Jogo Teste ${unique}`,
    descricao: 'Descrição teste',
    preco: 99.9,
    plataforma: 'PC',
    estoque: 10,
    imagem_url: 'https://teste.com/img.png'
  };
}

describe('Games', () => {
  it('deve listar jogos', async () => {
    const res = await request(app).get('/jogos?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('jogos');
  });

  it('deve retornar 404 se jogo não existir', async () => {
    const res = await request(app).get('/jogos/999999');

    expect(res.status).toBe(404);
  });

  it('deve fazer CRUD completo', async () => {
    const { token } = await getAdminToken();

    const create = await request(app)
      .post('/jogos')
      .set('Authorization', `Bearer ${token}`)
      .send(gamePayload());

    expect(create.status).toBe(201);

    const id = create.body.id;

    const get = await request(app).get(`/jogos/${id}`);
    expect(get.status).toBe(200);

    const update = await request(app)
      .put(`/jogos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...gamePayload(),
        titulo: 'Atualizado'
      });

    expect(update.status).toBe(200);
    expect(update.body.titulo).toBe('Atualizado');

    const del = await request(app)
      .delete(`/jogos/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(200);
  });
});