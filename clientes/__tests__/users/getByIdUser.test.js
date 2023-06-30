import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de PUT /api/admin/users/:id', () => {
  it('A rota deve retornar um status 200', async () => {
    const resp = await request(app).get('/api/admin/users')
      .set({ Authorization: `Bearer ${tokenAcess}` });
    const { _id } = resp.body[0];

    await request(app)
      .get(`/api/admin/users/${_id}`)
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um usuário, por ID', async () => {
    const resp = await request(app).get('/api/admin/users')
      .set({ Authorization: `Bearer ${tokenAcess}` });
    const { _id } = resp.body[0];

    const respId = await request(app).get(`/api/admin/users/${_id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` });
    expect(respId.body).toHaveProperty('_id');
    expect(respId.body).toHaveProperty('nome');
    expect(respId.body).toHaveProperty('cpf');
    expect(respId.body).toHaveProperty('email');
    expect(respId.body).toHaveProperty('telefone');
    expect(respId.body).toHaveProperty('rendaMensal');
    expect(respId.body).toHaveProperty('endereço');
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    await request(app)
      .get('/api/admin/users/1231255878617263')
      .expect(401);
  });
  it('A rota deve retornar um status 404 ao passar Id invalido', async () => {
    await request(app)
      .get('/api/admin/users/649f30d82a97ec9e4ff6e891')
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(404);
  });
});
