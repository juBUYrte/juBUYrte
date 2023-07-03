import request from 'supertest';
import {
  describe, expect, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de POST /api/admin/users', () => {
  it('Deve criar um User', async () => {
    const user = {

      nome: 'Joana4',
      cpf: '12345678910',
      email: 'joana4@gmail.com',
      telefone: '8399889999',
      rendaMensal: 3800,
      endereço: {
        rua: 'casa do Ó',
        numero: 'b1',
        complemento: 'casa',
        cep: '21371670',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
      },
      dadosDoCartao: {
        numero: '1234682156788765',
        nome: 'Joana4 Ana',
        validade: '11/31',
        codigo: '345',
        vencimento: '10',
      },
    };
    const resp = await request(app).post('/api/admin/users').send({
      nome: 'Joana4',
      cpf: '12345678910',
      email: 'joana4@gmail.com',
      telefone: '8399889999',
      rendaMensal: 3800,
      endereço: {
        rua: 'casa do Ó',
        numero: 'b1',
        complemento: 'casa',
        cep: '21371670',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
      },
      dadosDoCartao: {
        numero: '1234682156788765',
        nome: 'Joana4 Ana',
        validade: '11/31',
        codigo: '345',
        vencimento: '10',
      },
    }).expect(201);

    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty('_id');
    expect(resp.body.nome).toBe(user.nome);
    expect(resp.body.cpf).toBe(user.cpf);
    expect(resp.body.email).toBe(user.email);
    expect(resp.body.telefone).toBe(user.telefone);
    expect(resp.body.rendaMensal).toBe(user.rendaMensal);
    expect(resp.body.endereço.rua).toBe(user.endereço.rua);
    expect(resp.body.endereço.numero).toBe(user.endereço.numero);
    expect(resp.body.endereço.complemento).toBe(user.endereço.complemento);
    expect(resp.body.endereço.cep).toBe(user.endereço.cep);
    expect(resp.body.endereço.cidade).toBe(user.endereço.cidade);
    expect(resp.body.endereço.estado).toBe(user.endereço.estado);
    expect(typeof resp.body.dadosDoCartao.numero).toBe('string');
    expect(typeof resp.body.dadosDoCartao.nome).toBe('string');
    expect(typeof resp.body.dadosDoCartao.validade).toBe('string');
    expect(typeof resp.body.dadosDoCartao.codigo).toBe('string');
    expect(typeof resp.body.dadosDoCartao.vencimento).toBe('string');
    expect(typeof resp.body.nome).toBe('string');
    expect(typeof resp.body.cpf).toBe('string');
    expect(typeof resp.body.email).toBe('string');
    expect(typeof resp.body.telefone).toBe('string');
    expect(typeof resp.body.rendaMensal).toBe('number');
    expect(typeof resp.body.endereço.rua).toBe('string');
    expect(typeof resp.body.endereço.numero).toBe('string');
    expect(typeof resp.body.endereço.complemento).toBe('string');
    expect(typeof resp.body.endereço.cep).toBe('string');
    expect(typeof resp.body.endereço.cidade).toBe('string');
    expect(typeof resp.body.endereço.estado).toBe('string');

    const { _id } = resp.body;
    await request(app)
      .delete(`/api/admin/users/${_id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` });
  });

  it('Deve retornar um erro 409, quando passado email existente', async () => {
    const invalidUser = {
      nome: 'Ana Carolina Lima',
      cpf: '12345678910',
      email: 'carolina@gmail.com',
      telefone: '8399999999',
      rendaMensal: '4800',
      endereço: {
        rua: 'casa do Ó',
        numero: 'b12',
        complemento: 'casa',
        cep: '21371450',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
      },
      dadosDoCartao: {
        numero: '1234432156788765',
        nome: 'Ana C Lima',
        validade: '12/30',
        codigo: '789',
        vencimento: '12',
      },
    };
    const resp = await request(app).post('/api/admin/users').send(invalidUser);
    expect(resp.status).toBe(409);

    expect(resp.body).toHaveProperty('keyValue');
  });

  it('Deve retornar um erro 409, quando o body é inválido', async () => {
    const invalidUser = {};
    await request(app).post('/api/admin/users').send(invalidUser).expect(409);
  });
});
