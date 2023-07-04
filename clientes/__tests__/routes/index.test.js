import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Teste da rota GET localhost:3001', () => {
  it('Deve retornar um Token', async () => {
    const req = await request(app).get('/');
    const esp = { titulo: 'Clientes API' };
    expect(req.body).toEqual(esp);
  });
  it('Deve retornar um status 200', async () => {
    await request(app).get('/').expect(200);
  });
});
