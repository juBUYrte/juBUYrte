/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-relative-packages */
import axios from 'axios';
import TokenGenerator from '../../src/util/tokenGenerator.js';
import createNewCliente from './clientFactory.js';

const TRANSACTION_HOSTNAME = 'localhost';
const TRANSACTION_PORT = '3002';
const TRANSACTION_URL = `http://${TRANSACTION_HOSTNAME}:${TRANSACTION_PORT}`;

export default async function createNewTransaction() {
  const token = await TokenGenerator.clients();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const newUser = await createNewCliente();
  const validTransactionData = {
    dadosDoCartao: {
      numero: '123456789101234',
      nome: 'Joao Teste',
      validade: '1994/20/12',
      codigo: '505',
    },
    valor: 750,
  };

  try {
    const newTransaction = await axios.post(`${TRANSACTION_URL}/api/admin/transactions`, validTransactionData, config);
    return { newTransaction, userId: newUser.data._id };
  } catch (error) {
    return error;
  }
}
