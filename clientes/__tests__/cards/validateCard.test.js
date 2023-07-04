import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de POST /api/admin/users/cards', () => {
  it('Deve retornar um Id', async () => {
    const object = {
      id: expect.any(String),
    };
    const resp = await request(app).post('/api/admin/users/cards').send({
      numero: '1234432156788765',
      nome: 'Ana C Lima',
      validade: '12/30',
      codigo: '789',

    })
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(200);

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('id');
    expect(resp.body).toEqual(object);
  });

  it('Deve retornar um status 200', async () => {
    const cart = {
      numero: '1234432156788765',
      nome: 'Ana C Lima',
      validade: '12/30',
      codigo: '789',
    };
    const resp = await request(app).post('/api/admin/users/cards').send(cart)
      .set({ Authorization: `Bearer ${tokenAcess}` });
    expect(resp.status).toBe(200);
  });

  it('Deve retornar um erro 409, quando não passado chaves requeridas', async () => {
    const invalidCard = {
      numero: '1234432156788765',
      nome: 'Ana C Lima',
      validade: '12/30',
    };
    await request(app).post('/api/admin/users/cards')
      .set({ Authorization: `Bearer ${tokenAcess}` }).send(invalidCard)
      .expect(409);
  });
  it('Deve retornar um erro 400, quando o body é inválido', async () => {
    const invalidCard = {
      numero: '1234432156788761',
      nome: 'Ana C Lima',
      validade: '12/30',
      codigo: '789',
    };
    await request(app).post('/api/admin/users/cards').send(invalidCard)
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(400);
  });
});
