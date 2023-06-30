import request from 'supertest';
import {
  beforeAll, afterAll, describe, expect, it, jest,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da rota de login', () => {
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
      email: 'isa99@mail.com',
      senha: '1234',
    };
    await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(204);
  });
  it('A rota deve retornar um status 400 ao passar dados invalidos', async () => {
    const object = {
      email: 'isa99@mail.com',
      senha: '12345',
    };
    await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(400);
  });
  it('A rota deve retornar um token', async () => {
    const object = {
      email: 'isa99@mail.com',
      senha: '1234',
    };
    const req = await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(204);

    const bearer = req.header.authorization.split(' ')[0];
    console.log(bearer);

    console.log(typeof req.header.authorization);
  });

//   it('O POST deve conseguir fazer o login de admin.', async () => {
//     await request(app)
//       .get('/api/admin/accounts/login')
//       .set('Accept', 'application/json')
//       .expect('content-type', /json/)
//       .expect(200);
//   });
});
