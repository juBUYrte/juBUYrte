/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import express from 'express';
import inicializarPassport from './authentication/auth.js';
import db from './config/dbConnect.js';
import routes from './routes/index.js';

dotenv.config();
db.on('error', console.log.bind(console, 'Erro de conexão'));

db.once('open', () => {
  console.log('conexão com o banco feita com sucesso');
});

const app = express();
app.use(express.json());
inicializarPassport();
routes(app);

export default app;
