import request from 'supertest';
import {
  describe, it,
} from '@jest/globals';
import app from '../../src/app.js';
import createTokenClient from '../../solutions/token.js';

const tokenAcess = await createTokenClient();

describe('Testes da rota de DELETE /api/admin/users/:id', () => {
  it('A rota deve retornar um status 204', async () => {
    const newObject = {
      nome: 'Ana delete Lima',
      cpf: '12345678910',
      email: 'delete@gmail.com',
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

    const resp = await request(app).post('/api/admin/users').send(newObject).expect(201);
    const { _id } = resp.body;

    await request(app)
      .delete(`/api/admin/users/${_id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(204);
  });
  it('A rota deve deletar um usuario', async () => {
    const newObject = {
      nome: 'Ana delete Lima',
      cpf: '12345678910',
      email: 'delete@gmail.com',
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

    const resp = await request(app).post('/api/admin/users').send(newObject).expect(201);
    const { _id } = resp.body;
    await request(app)
      .delete(`/api/admin/users/${_id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(204);
  });

  it('A rota deve retornar um status 404 para um ID invalido', async () => {
    const id = '649aeba13013a85247a77b1a';
    await request(app)
      .delete(`/api/admin/users/${id}`)
      .set({ Authorization: `Bearer ${tokenAcess}` })
      .expect(404);
  });
  it('A rota deve retornar um status 401 ao não passar token de acesso', async () => {
    const id = '649aeba13013a85247a77b1a';
    await request(app)
      .delete(`/api/admin/users/${id}`)
      .expect(401);
  });
});
