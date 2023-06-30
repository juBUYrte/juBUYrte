import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../soluctions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de POST /api/admin/accounts', () => {
  it('Deve criar um Account', async () => {
    const accountRetorn = {
      _id: expect.any(String),
      nome: 'usuario criado TESTE',
      email: 'CRIANDO51@mail.com',
      senha: '1234',
    };
    const resp = await request(app).post('/api/admin/accounts').send({
      nome: 'usuario criado TESTE',
      email: 'CRIANDO51@mail.com',
      senha: '1234',
    }).expect(201);

    expect(resp.body.nome).toBe(accountRetorn.nome);
    expect(resp.body.email).toBe(accountRetorn.email);
    expect(typeof resp.body.senha).toBe('string');
    expect(typeof resp.body._id).toBe('string');

    const { _id } = resp.body;
    await request(app)
      .delete(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` });
  });
  it('Deve retornar um erro 409, quando passado email existente', async () => {
    const invalidAccount = {
      nome: 'usuario criado TESTE',
      email: 'usuario4@mail.com',
      senha: '1234',
    };
    const resp = await request(app).post('/api/admin/accounts').send(invalidAccount);
    expect(resp.status).toBe(409);
    expect(resp.body).toHaveProperty('message');
  });
  it('Deve retornar um erro 500, quando o body é inválido', async () => {
    const invalidAccount = {};
    const resp = await request(app).post('/api/admin/accounts').send(invalidAccount);
    expect(resp.status).toBe(409);
    expect(resp.body).toHaveProperty('message');
  });
});
