/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../src/app.js';
import cleanAnalysisDB from '../utils.js';

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
  status: 'Em Análise',
};

describe('POST api/admin/analysis - Criação de análise', () => {
  it('Deve responder com status 401, caso não seja fornecido o token de autenticação', async () => {
    const response = await request.post('/api/admin/analysis').send(validAnalysis);

    expect(response.status).toBe(401);
  });
});
