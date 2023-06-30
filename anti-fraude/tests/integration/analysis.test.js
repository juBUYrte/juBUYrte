/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../src/app.js';
import createNewAccount from '../factory/accountsFactory.js';
import createNewCliente from '../factory/clientFactory.js';
import createNewTransaction from '../factory/transactionsFactory.js';
import { cleanAnalysisDB, createValidToken, deleteCreatedClient } from '../utils.js';

let server;

beforeAll(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(async () => {
  await cleanAnalysisDB();
});

afterAll(async () => {
  await server.close();
});

const request = supertest(app);

const validAnalysis = {
  clientId: 'idQualquer',
  transactionId: 'idQualquer',
  status: 'EmssssAnálise',
};

describe('POST api/admin/analysis - Criação de análise', () => {
  it('Deve responder com status 401 e uma mensagem de erro, caso não seja fornecido header', async () => {
    const response = await request.post('/api/admin/analysis').send(validAnalysis);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 401 e uma mensagem de erro, caso seja fornecido o header, porém sem token', async () => {
    const response = await request.post('/api/admin/analysis').set('Authorization', '').send(validAnalysis);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 400 e uma mensagem de erro, caso seja fornecido um token inválido', async () => {
    const invalidToken = 'INVALID_TOKEN';
    const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${invalidToken}`).send(validAnalysis);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  describe('Quando o token for válido', () => {
    const invalidAnalysis = (clientId, transactionId, status) => ({
      clientId,
      transactionId,
      status,
    });
    // it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um id inválido de um cliente', async () => {
    //   const newAccount = await createNewAccount();
    //   const validToken = createValidToken(newAccount._id.toHexString());

    //   const newTransaction = await createNewTransaction();
    //   const analysis = invalidAnalysis('ID_INVÁLIDO', newTransaction._id.toHexString(), 'Aprovada');

    //   const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);

    //   expect(response.status).toBe(400);
    // });

    // it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um id inválido de uma transação', async () => {
    //   const newAccount = await createNewAccount();
    //   const validToken = createValidToken(newAccount._id.toHexString());
    //   const newClient = await createNewCliente();
    //   const analysis = invalidAnalysis(newClient._id.toHexString(), 'ID_INVÁLIDO', 'Aprovada');

    //   const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
    //   console.log(response.body);

    //   expect(response.status).toBe(400);

    //   deleteCreatedClient(response.body._id);
    // });

    // it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um status inválido', async () => {
    //   const newAccount = await createNewAccount();
    //   const validToken = createValidToken(newAccount._id.toHexString());
    //   const newClient = await createNewCliente();
    //   const newTransaction = await createNewTransaction();
    //   const analysis = invalidAnalysis(newClient._id.toHexString(), newTransaction._id.toHexString(), 'STATUS_ERRADO');

    //   const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);

    //   expect(response.status).toBe(400);
    // });
  });
});
