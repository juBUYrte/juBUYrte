import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de GET /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 200', async () => {
    const resp = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${tokenAcess}` });
    const { _id } = resp.body[0];

    await request(app)
      .get(`/api/admin/accounts/${_id}`)
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um usuário, por ID', async () => {
    const resp = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${tokenAcess}` });
    const {
      _id, email, senha,
    } = resp.body[0];

    const respId = await request(app).get(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` });
    expect(respId.body).toHaveProperty('_id');
    expect(respId.body).toHaveProperty('nome');
    expect(respId.body.email).toBe(email);
    expect(respId.body.senha).toBe(senha);
  });
  it('A rota deve retornar um status 404 ao não passar Id invalido', async () => {
    await request(app)
      .get('/api/admin/accounts/649c3d4f67d28be127782a60')
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao  passar token de acesso', async () => {
    await request(app)
      .get('/api/admin/accounts/649c3d4f67d28be127782a60')
      .expect(401);
  });
});
