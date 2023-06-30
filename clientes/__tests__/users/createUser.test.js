// import request from 'supertest';
// import {
//   beforeAll, afterAll, describe, expect, it, jest,
// } from '@jest/globals';
// import app from '../../src/app.js';

// describe('Testes da rota de POST /api/admin/users', () => {
//   it('Deve criar um User', async () => {
//     const user = {
//       _id: expect.any(String),
//       nome: expect.any(String),
//       cpf: expect.any(String),
//       email: expect.any(String),
//       telefone: expect.any(String),
//       rendaMensal: expect.any(String),
//       endereço: {
//         rua: expect.any(String),
//         numero: expect.any(String),
//         complemento: expect.any(String),
//         cep: expect.any(String),
//         cidade: expect.any(String),
//         estado: expect.any(String),
//       },
//       dadosDoCartao: {
//         numero: expect.any(String),
//         nome: expect.any(String),
//         validade: expect.any(String),
//         codigo: expect.any(Number),
//         vencimento: expect.any(String),
//       },
//     };
//     const resp = await request(app).post('/api/admin/accounts').send(user);
//     expect(resp.status).toBe(201);
//     expect(resp.body).toHaveProperty('_id');
//     expect(resp.body.nome).toBe(user.nome);
//     expect(resp.body.cpf).toBe(user.cpf);
//     expect(resp.body.email).toBe(user.email);
//     expect(resp.body.telefone).toBe(user.telefone);
//     expect(resp.body.rendaMensal).toBe(user.rendaMensal);
//     expect(resp.body.endereço.rua).toBe(user.endereço.rua);
//     expect(resp.body.endereço.numero).toBe(user.endereço.numero);
//     expect(resp.body.endereço.complemento).toBe(user.endereço.complemento);
//     expect(resp.body.endereço.cep).toBe(user.endereço.cep);
//     expect(resp.body.endereço.cidade).toBe(user.endereço.cidade);
//     expect(resp.body.endereço.estado).toBe(user.endereço.estado);
//     expect(resp.body.dadosDoCartao.numero).toBe(user.dadosDoCartao.numero);
//     expect(resp.body.dadosDoCartao.nome).toBe(user.dadosDoCartao.nome);
//     expect(resp.body.dadosDoCartao.validade).toBe(user.dadosDoCartao.validade);
//     expect(resp.body.dadosDoCartao.codigo).toBe(user.dadosDoCartao.codigo);
//     expect(resp.body.dadosDoCartao.vencimento).toBe(user.dadosDoCartao.vencimento);
//     // const object = {
//     //   email: 'isa99@mail.com',
//     //   senha: '1234',
//     // };
//     // await request(app)
//     //   .post('/api/accounts/login')
//     //   .send(object)
//     //   .expect(204);
//   });

//   it('Deve retornar um erro 500, quando o body é inválido', async () => {
//     const invalidUser = {
//       _id: expect.any(String),
//       nome: '',
//       cpf: expect.any(String),
//       email: expect.any(String),
//       telefone: expect.any(String),
//       rendaMensal: expect.any(String),
//       endereço: {
//         rua: expect.any(String),
//         numero: expect.any(String),
//         complemento: expect.any(String),
//         cep: expect.any(String),
//         cidade: expect.any(String),
//         estado: expect.any(String),
//       },
//       dadosDoCartao: {
//         numero: expect.any(String),
//         nome: expect.any(String),
//         validade: expect.any(String),
//         codigo: expect.any(Number),
//         vencimento: expect.any(String),
//       },
//     };
//     const resp = await request(app).post('/api/admin/accounts').send(invalidUser);
//     expect(resp.status).toBe(500);
//     expect(resp.body).toHaveProperty('message');
//   });
// });