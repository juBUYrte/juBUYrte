import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de GET /api/admin/users', () => {
  it('A rota deve retornar um status 200', async () => {
    await request(app)
      .get('/api/admin/users')
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um array de objetos', async () => {
    const req = await request(app).get('/api/admin/users')
      .set({ Authorization: `Bearer ${tokenAcess}` });

    expect(Array.isArray(req.body)).toBe(true);
    req.body.forEach((dados) => {
      expect(typeof dados).toEqual('object');
    });
  });
  it('Os objetos devem conter as chaves requeridas', async () => {
    const req = await request(app).get('/api/admin/users')
      .set({ Authorization: `Bearer ${tokenAcess}` });

    const objetoTest = {
      endereço: {
        rua: expect.any(String),
        numero: expect.any(String),
        complemento: expect.any(String),
        cep: expect.any(String),
        cidade: expect.any(String),
        estado: expect.any(String),
      },
      _id: expect.any(String),
      nome: expect.any(String),
      cpf: expect.any(String),
      email: expect.any(String),
      telefone: expect.any(String),
      rendaMensal: expect.any(Number),

    };

    req.body.forEach((user) => {
      expect(user).toEqual(expect.objectContaining(objetoTest));
    });
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    await request(app)
      .get('/api/admin/users')
      .expect(401);
  });
});
