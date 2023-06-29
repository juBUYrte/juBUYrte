import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da rota de PUT /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 200', async () => {
    await request(app)
      .get('/api/admin/accounts')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um usuário, por ID', async () => {
    const resp = await request(app).get('/api/admin/accounts');
    const {
      _id, nome, email, senha,
    } = resp.body[0];
    console.log(_id);
    const respId = await request(app).get(`/api/admin/accounts/${_id}`);
    expect(respId.body).toHaveProperty('_id');
    expect(respId.body.nome).toBe(nome);
    expect(respId.body.email).toBe(email);
    expect(respId.body.senha).toBe(senha);
  });
});
