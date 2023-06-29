/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../../src/app.js';
import cleanAnalysisDB from '../utils.js';

const port = 3000;
const server = app.listen(port);

afterEach(async () => {
  await cleanAnalysisDB();
});

afterAll(async () => {
  await server.close();
});

const request = supertest(app);

describe('POST api/admin/analysis - Criação de análise', () => {

});
