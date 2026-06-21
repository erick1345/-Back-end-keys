import request from 'supertest';
import { app } from '../src/app';
import { getAdminToken, getUserToken, uniqueCpf, uniqueEmail } from './helpers';

function userPayload(overrides: Record<string, unknown> = {}) {
  return {
    nome: 'Usuário CRUD',
    email: uniqueEmail('crud'),
    cpf: uniqueCpf(),
    senha: 'Senha12345',
    nivel_acesso: 'cliente',
    ...overrides,
  };
}

describe('CRUD de Usuários (admin)', () => {
  // ---------- Casos de falha ----------

  it('deve bloquear a listagem sem token (401)', async () => {
    const res = await request(app).get('/admin/users');

    expect(res.status).toBe(401);
  });

  it('deve bloquear acesso de usuário comum (403)', async () => {
    const { token } = await getUserToken();

    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('deve falhar ao cadastrar sem campos obrigatórios (400)', async () => {
    const { token } = await getAdminToken();

    const res = await request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Sem dados' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('deve falhar ao editar usuário inexistente (404)', async () => {
    const { token } = await getAdminToken();

    const res = await request(app)
      .put('/admin/users/99999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Novo Nome' });

    expect(res.status).toBe(404);
  });

  it('deve falhar ao excluir usuário inexistente (404)', async () => {
    const { token } = await getAdminToken();

    const res = await request(app)
      .delete('/admin/users/99999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  // ---------- Fluxo completo: cadastrar -> listar -> editar -> excluir ----------

  it('deve executar o CRUD completo com sucesso', async () => {
    const { token } = await getAdminToken();

    // CADASTRAR
    const payload = userPayload();

    const create = await request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(create.status).toBe(201);
    expect(create.body).toHaveProperty('id');
    expect(create.body).not.toHaveProperty('senha');

    const id = create.body.id;

    // LISTAR (o usuário criado deve aparecer na lista)
    const list = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.some((u: any) => u.id === id)).toBe(true);

    // EDITAR
    const update = await request(app)
      .put(`/admin/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Nome Atualizado', nivel_acesso: 'admin' });

    expect(update.status).toBe(200);
    expect(update.body.user.nome).toBe('Nome Atualizado');
    expect(update.body.user.nivel_acesso).toBe('admin');

    // EXCLUIR
    const del = await request(app)
      .delete(`/admin/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(200);

    // CONFIRMAR EXCLUSÃO
    const getDeleted = await request(app)
      .get(`/admin/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getDeleted.status).toBe(404);
  });
});
