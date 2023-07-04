import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de GET /api/admin/users/cards/id', () => {
  it('Deve retornar um status 200', async () => {
    const respId = await request(app).post('/api/admin/users/cards').send({
      numero: '1234432156788765',
      nome: 'Ana C Lima',
      validade: '12/30',
      codigo: '789',
    })
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(200);

    await request(app).get(`/api/admin/users/cards/${respId.body.id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(200);
  });
  it('Deve retornar um id na resposta da requisição', async () => {
    const cart = {
      numero: '1234432156788765',
      nome: 'Ana C Lima',
      validade: '12/30',
      codigo: '789',
    };

    const respId = await request(app).post('/api/admin/users/cards').send(cart)
      .set({ Authorization: `Bearer ${tokenAcess}` });
    const resp = await request(app).get(`/api/admin/users/cards/${respId.body.id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` });
    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty('rent');
    expect(typeof resp.body.rent).toBe('number');
  });

  it('Deve retornar um erro 404, quando o Id é inválido', async () => {
    const id = '649f3d5328864cb8488c8464';

    const resp = await request(app).get(`/api/admin/users/cards/${id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` });
    expect(resp.status).toBe(404);
  });
});
