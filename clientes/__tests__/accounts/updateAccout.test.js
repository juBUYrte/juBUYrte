import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da rota de PUT /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 204', async () => {
    const resp = await request(app).get('/api/admin/accounts');
    const { _id } = resp.body[0];
    await request(app)
      .put(`/api/admin/accounts/${_id}`)
      .send({
        nome: 'NOME DO USUARIO ATUALIZADO5asdas',
      })
      .expect(204);
  });
  it('A rota deve atualizar um usuario', async () => {
    const resp = await request(app).get('/api/admin/accounts');
    const { _id } = resp.body[0];
    const atualizandoObjeto = await request(app)
      .put(`/api/admin/accounts/${_id}`)
      .send({
        nome: 'NOME DO USUARIO ATUALIZADO',
      })
      .expect(204);
    expect(atualizandoObjeto.statusCode).toBe(204);
  });
  it('A rota deve retornar um status 404 para um ID invalido', async () => {
    const id = '649aec324afa781f3c5a7759';
    await request(app)
      .put(`/api/admin/accounts/${id}`)
      .expect(404);
  });
});
