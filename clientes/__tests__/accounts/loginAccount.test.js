import request from 'supertest';
import {
  beforeAll, afterAll, describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da rota de POST /accounts/login', () => {
  let connection;

  beforeAll(() => {
    const PORT = 9999;
    connection = app.listen(PORT);
  });
  afterAll(() => {
    connection.close();
  });
  it('A rota deve retornar um status 204 ao passar dados validos', async () => {
    const object = {
      email: 'admin@mail.com',
      senha: 'admin',
    };
    await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(204);
  });
  it('A rota deve retornar um status 400 ao passar dados invalidos', async () => {
    const object = {
      email: 'usuario3@mail.com',
      senha: '12345',
    };
    await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(400);
  });
  it('A rota deve retornar um token', async () => {
    const object = {
      email: 'admin@mail.com',
      senha: 'admin',
    };
    const req = await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(204);

    const bearer = req.header.authorization.split(' ')[0];
    const token = req.header.authorization.split(' ')[1];
    expect(bearer).toBe('Bearer');
    expect(typeof token).toBe('string');
  });
});
