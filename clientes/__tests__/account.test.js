import request from 'supertest';
import {
  describe, expect, it, jest,
} from '@jest/globals';
import app from '../src/app.js';

describe('Testes do CRUD de Accounts', () => {
  it('O GET deve retornar uma lista de contas', async () => {
    await request(app)
      .get('/api/admin/accounts')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });

  let idResposta;
  describe('O POST deve criar uma nova conta com informações válidas', () => {
    it('Deve adicionar uma nova conta', async () => {
      const res = await request(app)
        .post('/api/admin/accounts')
        .send({
          nome: 'Tiago Pádua',
          cpf: '12345677910',
          email: 'tiagopadua@gmail.com',
          telefone: '2199999990',
          rendaMensal: '20800',
          endereço: {
            rua: 'Rua das Esmeraldas',
            numero: '251',
            complemento: 'Casa',
            cep: '22371450',
            cidade: 'Rio de Janeiro',
            estado: 'RJ',
          },
          dadosDoCartao: {
            numero: '1235432158788765',
            nome: 'Tiago Pádua',
            validade: '08/29',
            codigo: '777',
            vencimento: '06',
          },
        })
        .expect(201);
      idResposta = res.body._id;
    });
    it('Deve nao adicionar nada ao faltar informações', async () => {
      await request(app)
        .post('/api/admin/accounts')
        .send({})
        .expect(417);
    });
  });

  it('O GETBYID deve retornar uma conta específica', async () => {
    await request(app)
      .get(`/api/categories/${idResposta}`)
      .expect(200);
  });
});
