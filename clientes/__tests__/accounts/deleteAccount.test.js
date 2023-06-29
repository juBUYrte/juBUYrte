import request from 'supertest';
import {
  describe, it,
} from '@jest/globals';
import app from '../../src/app.js';

describe('Testes da rota de DELETE /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 204', async () => {
    const newObject = {
      nome: 'usuario teste DELETE',
      email: 'usuarioTesteDelet@mail.com',
      senha: '1234',
    };

    const resp = await request(app).post('/api/admin/accounts').send(newObject).expect(201);
    const { _id } = resp.body;
    console.log(_id);
    await request(app)
      .delete(`/api/admin/accounts/${_id}`)
      .expect(204);
  });
  it('A rota deve deletar um usuario', async () => {
    const newObject = {
      nome: 'usuario teste DELETE',
      email: 'usuarioTesteDelete8@mail.com',
      senha: '1234',
    };

    const resp = await request(app).post('/api/admin/accounts').send(newObject).expect(201);
    const { _id } = resp.body;
    console.log(_id);
    await request(app)
      .delete(`/api/admin/accounts/${_id}`)
      .expect(204);
  });

  it('A rota deve retornar um status 404 para um ID invalido', async () => {
    const id = '649aeba13013a85247a77b1a';
    await request(app)
      .delete(`/api/admin/accounts/${id}`)
      .expect(404);
  });
});
