/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import app from '../../src/app.js';
import createNewAccount from '../factory/accountsFactory.js';
import { createValidToken } from '../utils.js';

let server;
let newAccount;
let validToken;

beforeAll(() => {
  const port = 3050;
  server = app.listen(port);
});

beforeAll(async () => {
  newAccount = await createNewAccount();
  validToken = createValidToken(newAccount._id.toHexString());
});

afterAll(async () => {
  await server.close();
});

describe('Testes da rota de DELETE /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 204', async () => {
    const newObject = {
      nome: 'usuario teste DELETE',
      email: 'usuarioTesteDelet@mail.com',
      senha: '1234',
    };

    const resp = await request(app).post('/api/admin/accounts').send(newObject).expect(201);
    const { _id } = resp.body;

    await request(app)
      .delete(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` })
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
    await request(app)
      .delete(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(204);
  });

  it('A rota deve retornar um status 404 para um ID invalido', async () => {
    const id = '649aeba13013a8524787b1a';
    await request(app)
      .delete(`/api/admin/accounts/${id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    const id = '649aeba13013a8524777b1a';
    await request(app)
      .delete(`/api/admin/accounts/${id}`)
      .expect(401);
  });
});

describe('Testes da rota de GET /api/admin/accounts', () => {
  it('A rota deve retornar um status 200', async () => {
    await request(app)
      .get('/api/admin/accounts')
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${validToken}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um array de objetos', async () => {
    const req = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });
    // a resposta deve ser um array
    expect(Array.isArray(req.body)).toBe(true);
    req.body.forEach((dados) => {
      expect(typeof dados).toEqual('object');
    });
  });
  it('Os objetos devem conter as chaves requeridas', async () => {
    const req = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });

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
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    await request(app)
      .get('/api/admin/accounts')
      .expect(401);
  });
});

describe('Testes da rota de GET /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 200', async () => {
    const resp = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });
    const { _id } = resp.body[0];

    await request(app)
      .get(`/api/admin/accounts/${_id}`)
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${validToken}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um usuário, por ID', async () => {
    const resp = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });
    const {
      _id, email, senha,
    } = resp.body[0];

    const respId = await request(app).get(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` });
    expect(respId.body).toHaveProperty('_id');
    expect(respId.body).toHaveProperty('nome');
    expect(respId.body.email).toBe(email);
    expect(respId.body.senha).toBe(senha);
  });
  it('A rota deve retornar um status 404 ao não passar Id invalido', async () => {
    await request(app)
      .get('/api/admin/accounts/649c3d4f67d28be127782a60')
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao  passar token de acesso', async () => {
    await request(app)
      .get('/api/admin/accounts/649c3d4f67d28be127782a60')
      .expect(401);
  });
});

describe('Testes da rota de PUT /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 204', async () => {
    const resp = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });
    const { _id } = resp.body[0];
    await request(app)
      .put(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .send({
        nome: 'NOME DO USUARIO ATUALIZADO5asdas',
      })
      .expect(204);
  });
  it('A rota deve atualizar um usuario', async () => {
    const resp = await request(app).get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });
    const { _id } = resp.body[0];
    const atualizandoObjeto = await request(app)
      .put(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .send({
        nome: 'NOME DO USUARIO ATUALIZADO',
      })
      .expect(204);
    expect(atualizandoObjeto.statusCode).toBe(204);
  });
  it('A rota deve retornar um status 404 para um ID invalido', async () => {
    const id = '649c3d4f67d28be127782a60';
    await request(app)
      .put(`/api/admin/accounts/${id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    await request(app)
      .put('/api/admin/accounts/649c3d4f67d28be127782a60')
      .expect(401);
  });
});
