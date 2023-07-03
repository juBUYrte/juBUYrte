/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import axios from 'axios';
import supertest from 'supertest';
import app from '../../src/app.js';
import Analysis from '../../src/models/Analysis.js';
import { createNewAccount } from '../factory/accountsFactory.js';
import { createRejectedAndApprovedAnalysis, createSimpleAnalysis, createUnderReviewAnalysis } from '../factory/analysisFactory.js';
import createUserAndTransaction from '../factory/transactionsFactory.js';
import {
  cleanAnalysisDB, createValidToken, deleteCreatedClient, deleteCreatedTransaction,
} from '../utils.js';

let server;
let newAccount;
let userAndTransactionGenerator;
let validToken;

beforeAll(() => {
  const port = 3000;
  server = app.listen(port);
});

beforeAll(async () => {
  newAccount = await createNewAccount();
  validToken = createValidToken(newAccount._id.toHexString());
  userAndTransactionGenerator = await createUserAndTransaction();
});

afterEach(async () => {
  await cleanAnalysisDB();
});

afterAll(async () => {
  await deleteCreatedClient(userAndTransactionGenerator.newUser.data._id);
  await deleteCreatedTransaction(userAndTransactionGenerator.newTransaction.data._id);
  await server.close();
});

const request = supertest(app);

describe('POST api/admin/analysis - Criação de análise', () => {
  const mockAnalysis = {
    clientId: 'idQualquer',
    transactionId: 'idQualquer',
    status: 'Em Análise',
  };
  it('Deve responder com status 401 e uma mensagem de erro, caso não seja fornecido header', async () => {
    const response = await request.post('/api/admin/analysis').send(mockAnalysis);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 401 e uma mensagem de erro, caso seja fornecido o header, porém sem token', async () => {
    const response = await request.post('/api/admin/analysis').set('Authorization', '').send(mockAnalysis);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 400 e uma mensagem de erro, caso seja fornecido um token inválido', async () => {
    const invalidToken = 'INVALID_TOKEN';
    const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${invalidToken}`).send(mockAnalysis);

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
      const analysis = invalidAnalysis('ID_INVÁLIDO', userAndTransactionGenerator.newTransaction.data._id, 'Aprovada');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      expect(response.status).toBe(400);
    });

    it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um id inválido de uma transação', async () => {
      const analysis = invalidAnalysis(userAndTransactionGenerator.newUser.data._id, 'ID_INVÁLIDO', 'Aprovada');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
    });

    it('deverá retornar status 400 e a respectiva mensagem de erro, ao fornecer um status inválido', async () => {
      const analysis = invalidAnalysis(userAndTransactionGenerator.newUser.data._id, userAndTransactionGenerator.newTransaction.data._id, 'STATUS_INVÁLIDO');

      const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
      expect(response.body).toEqual(expect.objectContaining({
        message: expect.any(String),
      }));
      expect(response.status).toBe(400);
    });

    describe('Quando o body fornecido for válido', () => {
      it('deverá retornar status 201 e a análise criada, com status default "Em análise".', async () => {
        const analysis = {
          clientId: userAndTransactionGenerator.newUser.data._id,
          transactionId: userAndTransactionGenerator.newTransaction.data._id,
        };

        const response = await request.post('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`).send(analysis);
        expect(response.body.status).toBe('Em análise');
        expect(response.status).toBe(201);
      });
    });
  });
});

describe('GET api/admin/analysis - Listagem de análise em revisão (status "Em análise))', () => {
  it('Deve responder com status 401 e uma mensagem de erro, caso não seja fornecido header', async () => {
    const response = await request.get('/api/admin/analysis');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 401 e uma mensagem de erro, caso seja fornecido o header, porém sem token', async () => {
    const response = await request.get('/api/admin/analysis').set('Authorization', '');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 400 e uma mensagem de erro, caso seja fornecido um token inválido', async () => {
    const invalidToken = 'INVALID_TOKEN';
    const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  describe('Quando o token for válido', () => {
    it('deverá retornar status 200 e uma array vazia, quando não houver análises em revisão', async () => {
      const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`);

      expect(response.body.length).toBe(0);
      expect(response.status).toBe(200);
    });

    it('deverá retornar status 200 e uma array vazia, quando só houver análises aprovadas e/ou rejeitadas.', async () => {
      const clientId = userAndTransactionGenerator.newUser.data._id;
      const transactionId = userAndTransactionGenerator.newTransaction.data._id;

      await createRejectedAndApprovedAnalysis(clientId, transactionId);

      const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${validToken}`);

      expect(response.body.length).toBe(0);
      expect(response.status).toBe(200);
    });

    it('deverá retornar status 200 e a lista de análises em revisão, contendo as informações necessárias', async () => {
      const clientId = userAndTransactionGenerator.newUser.data._id;
      const transactionId = userAndTransactionGenerator.newTransaction.data._id;
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
    });
  });
});

describe('GET api/admin/analysis/:id - Listagem de análise específica)', () => {
  it('Deve responder com status 401 e uma mensagem de erro, caso não seja fornecido header', async () => {
    const response = await request.get('/api/admin/analysis');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 401 e uma mensagem de erro, caso seja fornecido o header, porém sem token', async () => {
    const response = await request.get('/api/admin/analysis').set('Authorization', '');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 400 e uma mensagem de erro, caso seja fornecido um token inválido', async () => {
    const invalidToken = 'INVALID_TOKEN';
    const response = await request.get('/api/admin/analysis').set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  describe('Quando o token for válido', () => {
    it('deverá retornar status 500, caso seja passado um id inválido', async () => {
      const response = await request.get('/api/admin/analysis/ID_INEXISTENTE').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
    });

    it('deverá retornar status 404, caso seja passado um id válido, mas não seja encontrada nenhuma análise com o id fornecido', async () => {
      const response = await request.get('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });

    it('deverá retornar status 200 e as informações da análise, juntamente com os dados do usuário respectivo', async () => {
      const clientId = userAndTransactionGenerator.newUser.data._id;
      const transactionId = userAndTransactionGenerator.newTransaction.data._id;

      const analysis = await createSimpleAnalysis(clientId, transactionId);

      const response = await request.get(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`);
      expect(response.status).toBe(200);
      expect(Object.keys(response.body)).toEqual(expect.arrayContaining(['analysis', 'dadosUsuario']));
    });
  });
});

describe('DELETE api/admin/analysis/:id - Exclusão de uma análise específica)', () => {
  it('Deve responder com status 401 e uma mensagem de erro, caso não seja fornecido header', async () => {
    const response = await request.delete('/api/admin/analysis/649f9d3dc98547996f30f4a2');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 401 e uma mensagem de erro, caso seja fornecido o header, porém sem token', async () => {
    const response = await request.delete('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', '');

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 400 e uma mensagem de erro, caso seja fornecido um token inválido', async () => {
    const invalidToken = 'INVALID_TOKEN';
    const response = await request.delete('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  describe('Quando o token for válido', () => {
    it('deverá retornar status 422, caso seja passado um id inválido', async () => {
      const response = await request.delete('/api/admin/analysis/ID_INVALIDO').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(422);
    });

    it('deverá retornar status 404, caso seja passado um id válido, mas não seja encontrada nenhuma análise com o id fornecido', async () => {
      const response = await request.delete('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });

    it.each([
      ['"Em análise"', 'Em análise'],
      ['"Rejeitada"', 'Rejeitada'],
    ])('deverá retornar status 401, caso seja passado um id válido, porém a análise esteja com status de %s.', async (title, mock) => {
      const clientId = userAndTransactionGenerator.newUser.data._id;
      const transactionId = userAndTransactionGenerator.newTransaction.data._id;

      const analysis = await createSimpleAnalysis(clientId, transactionId, mock);

      const response = await request.delete(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(401);
    });

    it('deverá retornar status 200 e as informações da análise deletada, em caso de sucesso na requisição.', async () => {
      const clientId = userAndTransactionGenerator.newUser.data._id;
      const transactionId = userAndTransactionGenerator.newTransaction.data._id;

      const analysis = await createSimpleAnalysis(clientId, transactionId, 'Aprovada');

      const response = await request.delete(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(analysis._id.toHexString());
    });
  });
});

describe('PATCH api/admin/analysis/:id - Atualização de status de análise)', () => {
  it('Deve responder com status 401 e uma mensagem de erro, caso não seja fornecido header', async () => {
    const status = {
      status: 'Aprovada',
    };
    const response = await request.patch('/api/admin/analysis/649f9d3dc98547996f30f4a2').send(status);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 401 e uma mensagem de erro, caso seja fornecido o header, porém sem token', async () => {
    const status = {
      status: 'Aprovada',
    };
    const response = await request.patch('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', '').send(status);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  it('Deve responder com status 400 e uma mensagem de erro, caso seja fornecido um token inválido', async () => {
    const status = {
      status: 'Aprovada',
    };
    const invalidToken = 'INVALID_TOKEN';
    const response = await request.patch('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', `Bearer ${invalidToken}`).send(status);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: expect.any(String),
    }));
  });

  describe('Quando o token for válido', () => {
    it('deverá retornar status 422, caso seja passado um id inválido', async () => {
      const status = {
        status: 'Aprovada',
      };

      const response = await request.patch('/api/admin/analysis/ID_INVALIDO').set('Authorization', `Bearer ${validToken}`).send(status);

      expect(response.status).toBe(422);
    });

    it('deverá retornar status 404, caso seja passado um id válido, mas não seja encontrada nenhuma análise com o id fornecido', async () => {
      const status = {
        status: 'Aprovada',
      };

      const response = await request.patch('/api/admin/analysis/649f9d3dc98547996f30f4a2').set('Authorization', `Bearer ${validToken}`).send(status);

      expect(response.status).toBe(404);
    });

    it.each([
      ['"Aprovada"', 'Aprovada'],
      ['"Rejeitada"', 'Rejeitada'],
    ])('deverá retornar status 400, caso seja passado um id válido, porém a análise esteja com status de %s.', async (title, mock) => {
      const status = {
        status: 'Aprovada',
      };

      const clientId = userAndTransactionGenerator.newUser.data._id;
      const transactionId = userAndTransactionGenerator.newTransaction.data._id;

      const analysis = await createSimpleAnalysis(clientId, transactionId, mock);

      const response = await request.patch(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`).send(status);

      expect(response.status).toBe(400);
    });

    // it('deverá retornar status 204, em caso de sucesso na requisição.', async () => {
    //   const status = {
    //     status: 'Aprovada',
    //   };

    //   const newUserAndTransaction = await createUserAndTransaction('test.patch2@mail.com');

    //   const clientId = newUserAndTransaction.newUser.data._id;
    //   const transactionId = newUserAndTransaction.newTransaction.data._id;

    //   const analysis = await createSimpleAnalysis(clientId, transactionId);

    //   const response = await request.patch(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`).send(status);
    //   console.log(response);

    //   expect(response.status).toBe(204);
    //   await deleteCreatedClient(newUserAndTransaction.newUser.data._id);
    //   await deleteCreatedTransaction(newUserAndTransaction.newTransaction.data._id);
    // });

    it.each([
      ['"Aprovada"', 'Aprovada'],
      ['"Rejeitada"', 'Rejeitada'],
    ])('deverá atualizar o status da análise, no db de anti-fraude, em caso de sucesso na requisição. (status = %s)', async (title, mock) => {
      const status = {
        status: mock,
      };

      const newUserAndTransaction = await createUserAndTransaction('test_patch@mail.com');

      const clientId = newUserAndTransaction.newUser.data._id;
      const transactionId = newUserAndTransaction.newTransaction.data._id;

      const analysis = await createSimpleAnalysis(clientId, transactionId);

      await request.patch(`/api/admin/analysis/${analysis._id.toHexString()}`).set('Authorization', `Bearer ${validToken}`).send(status);

      const updatedAnalysis = await Analysis.findById(analysis._id);
      expect(updatedAnalysis.status).toBe(mock);

      await deleteCreatedClient(newUserAndTransaction.newUser.data._id);
      await deleteCreatedTransaction(newUserAndTransaction.newTransaction.data._id);
    });
  });
});
