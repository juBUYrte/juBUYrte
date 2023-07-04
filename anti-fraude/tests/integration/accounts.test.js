/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import supertest from 'supertest';
import app from '../../src/app.js';
import Account from '../../src/models/Account.js';
import { createNewAccount, createNewHashedAccount } from '../factory/accountsFactory.js';
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

const request = supertest(app);

describe('GET /', () => {
  it('A rota deve retornar um status 200', async () => {
    const response = await request.get('/');

    expect(response.status).toBe(200);
  });
});

describe('GET /api/admin/accounts', () => {
  it('A rota deve retornar um status 200', async () => {
    await request
      .get('/api/admin/accounts')
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${validToken}` })
      .expect('content-type', /json/)
      .expect(200);
  });
  it('A rota deve retornar um array de objetos', async () => {
    const req = await request.get('/api/admin/accounts')
      .set({ Authorization: `Bearer ${validToken}` });
    // a resposta deve ser um array
    expect(Array.isArray(req.body)).toBe(true);
    req.body.forEach((dados) => {
      expect(typeof dados).toEqual('object');
    });
  });
  it('Os objetos devem conter as chaves requeridas', async () => {
    const req = await request.get('/api/admin/accounts')
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
    await request
      .get('/api/admin/accounts')
      .expect(401);
  });
});

describe('GET /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 200', async () => {
    const response = await request.get(`/api/admin/accounts/${newAccount._id.toHexString()}`)
      .set({ Authorization: `Bearer ${validToken}` });

    expect(response.status).toBe(200);
  });
  it('A rota deve retornar um usuário, por ID', async () => {
    const response = await request.get(`/api/admin/accounts/${newAccount._id.toHexString()}`)
      .set({ Authorization: `Bearer ${validToken}` });

    expect(response.body).toEqual(expect.objectContaining({
      _id: newAccount._id.toHexString(),
      nome: newAccount.nome,
      email: newAccount.email,
      senha: newAccount.senha,
    }));
  });
  it('A rota deve retornar um status 404 ao não passar Id invalido', async () => {
    await request
      .get('/api/admin/accounts/649c3d4f67d28be127782a60')
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao  passar token de acesso', async () => {
    await request
      .get('/api/admin/accounts/649c3d4f67d28be127782a60')
      .expect(401);
  });
});

describe('POST /api/admin/accounts', () => {
  it('deve retornar status 409, quando um usuário fornecer um e-mail já utilizado', async () => {
    const emailParameter = 'email.utilizado@teste.com';
    await createNewAccount(emailParameter);
    const body = {
      nome: 'teste',
      email: emailParameter,
      senha: 'teste',
    };
    const response = await request.post('/api/admin/accounts').send(body);

    expect(response.status).toBe(409);
  });

  it.each([
    ['sem o campo nome', { senha: '123456', email: 'teste1@testando.com.br' }],
    ['sem o campo senha', { nome: 'Teste', email: 'teste2@testando.com.br' }],
    ['sem o campo email', { senha: '123456', nome: 'Teste' }],
  ])('deve retornar status 422, quando um usuário fornecer um body inválido. (%s)', async (title, mock) => {
    const response = await request.post('/api/admin/accounts').send(mock);

    expect(response.status).toBe(422);
  });

  it('A rota deve retornar um status 201, em casos de sucesso, e salvar a senha criptografada.', async () => {
    const body = {
      nome: 'teste',
      email: 'teste@mail.org.br',
      senha: 'teste',
    };
    const response = await request.post('/api/admin/accounts').send(body);

    await Account.deleteOne({ email: 'teste@mail.org.br' });
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.senha !== body.senha).toBe(true);
  });
});

describe('POST /api/accounts/login', () => {
  it.each([
    ['senha inválida', { email: 'sss', senha: 'senha_inválida' }],
    ['email inválido', { email: 'email.invalido@testando.com.br', senha: 'sss' }],
  ])('deve retornar status 401, quando um usuário fornecer %s.', async (title, mock) => {
    const response = await request.post('/api/accounts/login').send(mock);

    expect(response.status).toBe(401);
  });

  it('A rota deve retornar um status 204, em caso de sucesso de login.', async () => {
    const emailParameter = 'teste.login@teste.com';
    const passwordParameter = 'teste_senha';
    await createNewHashedAccount(emailParameter, passwordParameter);
    const body = {
      email: emailParameter,
      senha: passwordParameter,
    };

    const response = await request.post('/api/accounts/login').send(body);
    expect(response.status).toBe(204);
  });

  it('A rota deve retornar o token gerado no headers', async () => {
    const emailParameter = 'teste.headers@teste.com';
    const passwordParameter = 'teste_senha';
    await createNewHashedAccount(emailParameter, passwordParameter);
    const body = {
      email: emailParameter,
      senha: passwordParameter,
    };

    const response = await request.post('/api/accounts/login').send(body);
    expect(response.headers.authorization).toBeDefined();
  });
});

describe('PUT /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 204 e atualizar os dados do usuário no banco', async () => {
    const newUser = await createNewAccount('atualizado204@mail.com');

    const response = await request.put(`/api/admin/accounts/${newUser._id.toHexString()}`)
      .set({ Authorization: `Bearer ${validToken}` }).send({ nome: 'Nome atualizado' });

    const updatedUser = await Account.findById(newUser._id.toHexString());

    expect(updatedUser.nome).toBe('Nome atualizado');
    expect(response.status).toBe(204);
  });

  it('A rota deve retornar um status 404 para um ID inexistente', async () => {
    const response = await request.put('/api/admin/accounts/649c3d4f67d28be127782a60')
      .set({ Authorization: `Bearer ${validToken}` }).send({ nome: 'Nome atualizado' });

    expect(response.status).toBe(404);
  });

  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    await request
      .put('/api/admin/accounts/649c3d4f67d28be127782a60')
      .expect(401);
  });
});

describe('DELETE /api/admin/accounts/:id', () => {
  it('A rota deve retornar um status 204', async () => {
    const newObject = {
      nome: 'usuario teste DELETE',
      email: 'usuarioTesteDeleted@mail.com',
      senha: '1234',
    };

    const resp = await request.post('/api/admin/accounts').send(newObject).expect(201);
    const { _id } = resp.body;

    await request
      .delete(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(204);
  });
  it('A rota deve deletar um usuario', async () => {
    const newObject = {
      nome: 'usuario teste DELETE',
      email: 'usuarioTesteDelete@mail.com',
      senha: '1234',
    };

    const resp = await request.post('/api/admin/accounts').send(newObject).expect(201);
    const { _id } = resp.body;
    await request
      .delete(`/api/admin/accounts/${_id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(204);
  });

  it('A rota deve retornar um status 404 para um ID invalido', async () => {
    const id = '649c3d4f67d28be127782a60';
    await request
      .delete(`/api/admin/accounts/${id}`)
      .set({ Authorization: `Bearer ${validToken}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    const id = '649aeba13013a8524777b1a';
    await request
      .delete(`/api/admin/accounts/${id}`)
      .expect(401);
  });
});
