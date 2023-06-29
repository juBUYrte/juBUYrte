import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da rota de GET /api/admin/accounts', () => {
  it('A rota deve retornar um status 200', async () => {
    await request(app)
      .get('/api/admin/accounts')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um array de objetos', async () => {
    const req = await request(app).get('/api/admin/accounts');
    // a resposta deve ser um array
    expect(Array.isArray(req.body)).toBe(true);
    req.body.forEach((dados) => {
      expect(typeof dados).toEqual('object');
    });
  });
  it('Os objetos devem conter as chaves requeridas', async () => {
    const req = await request(app).get('/api/admin/accounts');

    const objetoTest = {
      _id: expect.any(String),
      nome: expect.any(String),
      email: expect.any(String),
      senha: expect.any(String),
    };
    req.body.forEach((dados) => {
      expect(dados).toEqual(expect.objectContaining(objetoTest));
    });
  });
});
