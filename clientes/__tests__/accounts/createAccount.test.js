import request from 'supertest';
import {
  beforeAll, afterAll, describe, expect, it, jest,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da criação de contas', () => {
  let connection;

  //   beforeAll(() => {
  //     const PORT = 9999;
  //     connection = app.listen(PORT);
  //   });
  //   afterAll(() => {
  //     connection.close();
  //   });

  it('IAAAAAAAAA', async () => {
    const object = {
      email: 'isa99@mail.com',
      senha: '1234',
    };
    await request(app)
      .post('/api/accounts/login')
      .send(object)
      .expect(204);
  });
});
