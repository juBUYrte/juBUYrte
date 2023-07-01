/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../src/app.js';
import createNewAccount from '../factory/accountsFactory.js';
import createNewCliente from '../factory/clientFactory.js';
import createNewTransaction from '../factory/transactionsFactory.js';
import {
  cleanAnalysisDB, createValidToken, deleteCreatedClient, deleteCreatedTransaction,
} from '../utils.js';

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
    it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um id inválido de um cliente', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const transactionRequest = await createNewTransaction();
      const analysis = invalidAnalysis('ID_INVÁLIDO', transactionRequest.newTransaction.data._id, 'Aprovada');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      expect(response.status).toBe(400);
      await deleteCreatedClient(transactionRequest.userId);
      await deleteCreatedTransaction(analysis.transactionId);
    });

    it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um id inválido de uma transação', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const newClient = await createNewCliente();
      const analysis = invalidAnalysis(newClient.data._id, 'ID_INVÁLIDO', 'Aprovada');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      await deleteCreatedClient(newClient.data._id);
    });

    it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um status inválido', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const transactionRequest = await createNewTransaction();
      const analysis = invalidAnalysis(transactionRequest.userId, transactionRequest.newTransaction.data._id, 'STATUS_INVÁLIDO');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      expect(response.status).toBe(400);
      await deleteCreatedClient(transactionRequest.userId);
      await deleteCreatedTransaction(analysis.transactionId);
    });

    describe('Quando o body fornecido for válido', () => {
      it('deverá retornar status 201 e a análise criada, com status default "Em análise".', async () => {
        const newAccount = await createNewAccount();
        const validToken = createValidToken(newAccount._id.toHexString());
        const transactionRequest = await createNewTransaction();
        const analysis = {
          clientId: transactionRequest.userId,
          transactionId: transactionRequest.newTransaction.data._id,
        };

        const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
        expect(response.body).toEqual(expect.objectContaining({
          clientId: transactionRequest.userId,
          transactionId: transactionRequest.newTransaction.data._id,
          status: 'Em análise',
          _id: expect.any(String),
          _links: expect.any(Object),
        }));
        expect(response.status).toBe(201);
        await deleteCreatedClient(transactionRequest.userId);
        await deleteCreatedTransaction(analysis.transactionId);
      });
    });
  });
});
