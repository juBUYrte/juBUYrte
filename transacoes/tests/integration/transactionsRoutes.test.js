/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import supertest from 'supertest';
import app from '../../src/app.js';
import { createNewAccount } from '../factory/accounts.js';
import goToken from '../../src/authentication/auth.js';

let newAccount;
let validToken;

beforeAll(async () => {
  newAccount = await createNewAccount('email.transacoes@teste.com');
  validToken = goToken(newAccount._id.toString());
});

const request = supertest(app);

describe('GET /', () => {
  it('A rota deve retornar um status 200', async () => {
    const response = await request.get('/');

    expect(response.status).toBe(200);
  });
});

describe('GET /api/admin/transactions', () => {
  it('A rota deve retornar um status 200', async () => {
    await request
      .get('/api/admin/transactions')
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${validToken}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um array de objetos', async () => {
    const req = await request.get('/api/admin/transactions')
      .set({ Authorization: `Bearer ${validToken}` });
    // a resposta deve ser um array
    expect(Array.isArray(req.body)).toBe(true);
    req.body.forEach((dados) => {
      expect(typeof dados).toEqual('object');
    });
  });
  it('Os objetos devem conter as chaves requeridas', async () => {
    const req = await request.get('/api/admin/transactions')
      .set({ Authorization: `Bearer ${validToken}` });

    const objetoTest = {
      _id: expect.any(String),
      valor: expect.any(Number),
      idUser: expect.any(String),
      status: expect.any(String),
    };
    req.body.forEach((dados) => {
      expect(dados).toEqual(expect.objectContaining(objetoTest));
    });
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    await request
      .get('/api/admin/transactions')
      .expect(401);
  });
});
