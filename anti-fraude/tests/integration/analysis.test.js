/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../src/app.js';
import createNewAccount from '../factory/accountsFactory.js';
import { createRejectedAndApprovedAnalysis, createSimpleAnalysis, createUnderReviewAnalysis } from '../factory/analysisFactory.js';
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
      await deleteCreatedClient(transactionRequest.newUser.data._id);
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
      const analysis = invalidAnalysis(transactionRequest.newUser.data._id, transactionRequest.newTransaction.data._id, 'STATUS_INVÁLIDO');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      expect(response.status).toBe(400);
      await deleteCreatedClient(transactionRequest.newUser.data._id);
      await deleteCreatedTransaction(analysis.transactionId);
    });

    describe('Quando o body fornecido for válido', () => {
      it('deverá retornar status 201 e a análise criada, com status default "Em análise".', async () => {
        const newAccount = await createNewAccount();
        const validToken = createValidToken(newAccount._id.toHexString());
        const transactionRequest = await createNewTransaction();
        const analysis = {
          clientId: transactionRequest.newUser.data._id,
          transactionId: transactionRequest.newTransaction.data._id,
        };

        const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
        expect(response.body).toEqual(expect.objectContaining({
          clientId: transactionRequest.newUser.data._id,
          transactionId: transactionRequest.newTransaction.data._id,
          status: 'Em análise',
          _id: expect.any(String),
          _links: expect.any(Object),
        }));
        expect(response.status).toBe(201);
        await deleteCreatedClient(transactionRequest.newUser.data._id);
        await deleteCreatedTransaction(analysis.transactionId);
      });
    });
  });
});

describe('GET api/admin/analysis - Listagem de análise em revisão (status "Em análise))', () => {
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
    let clientId;
    let transactionId;

    it('deverá retornar status 200 e uma array vazia, quando não houver análises em revisão', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`);

      expect(response.body.length).toBe(0);
      expect(response.status).toBe(200);
    });

    it('deverá retornar status 200 e uma array vazia, quando só houver análises aprovadas e/ou rejeitadas.', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const transactionRequest = await createNewTransaction();
      clientId = transactionRequest.newUser.data._id;
      transactionId = transactionRequest.newTransaction.data._id;

      await createRejectedAndApprovedAnalysis(clientId, transactionId);

      const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`);

      expect(response.body.length).toBe(0);
      expect(response.status).toBe(200);
    });

    it('deverá retornar status 200 e a lista de análises em revisão, contendo as informações necessárias', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      await createUnderReviewAnalysis(clientId, transactionId);

      const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`);

      expect(response.body.length).toBe(4);
      expect(response.body[0]).toEqual(expect.objectContaining({
        __v: expect.any(Number),
        _id: expect.any(String),
        clientId: expect.any(String),
        status: 'Em análise',
        transactionId: expect.any(String),
      }));
      expect(response.status).toBe(200);

      await deleteCreatedClient(clientId);
      await deleteCreatedTransaction(transactionId);
    });
  });
});

describe('GET api/admin/analysis/:id - Listagem de análise específica)', () => {
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
    it('deverá retornar status 404, caso seja passado um id inválido', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const response = await request.get('/api/admin/analysis/ID_INEXISTENTE').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
    });

    it('deverá retornar status 404, caso seja passado um id válido, mas não seja encontrada nenhuma análise com o id fornecido', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const response = await request.get('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });

    it('deverá retornar status 200 e as informações da análise, juntamente com os dados do usuário respectivo', async () => {
      const newAccount = await createNewAccount();
      const validToken = createValidToken(newAccount._id.toHexString());
      const transactionRequest = await createNewTransaction();

      const clientId = transactionRequest.newUser.data._id;
      const transactionId = transactionRequest.newTransaction.data._id;

      const analysis = await createSimpleAnalysis(clientId, transactionId);

      const response = await request.get(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(Object.keys(response.body)).toEqual(expect.arrayContaining(['analysis', 'dadosUsuario']));

      await deleteCreatedClient(clientId);
      await deleteCreatedTransaction(transactionId);
    });
  });
});
