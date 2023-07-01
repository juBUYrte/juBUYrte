/* eslint-disable import/no-relative-packages */
import axios from 'axios';
import TokenGenerator from '../../src/util/tokenGenerator.js';

const CLIENTS_HOSTNAME = 'localhost';
const CLIENTS_PORT = '3001';
const CLIENTS_URL = `http://${CLIENTS_HOSTNAME}:${CLIENTS_PORT}`;

export default async function createNewCliente() {
  const token = await TokenGenerator.clients();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const clientData = {
    nome: 'Joao Teste',
    cpf: '12345677910',
    email: 'resetado4@gmail.com',
    telefone: '8399959999',
    rendaMensal: '14800',
    endereço: {
      rua: 'Rua das Amendoeiras',
      numero: '10',
      complemento: 'Casa',
      cep: '21331450',
      cidade: 'Recife',
      estado: 'PE',
    },
    dadosDoCartao: {
      numero: '123456789101234',
      nome: 'Joao Teste',
      validade: '1994/20/12',
      codigo: '505',
      vencimento: '18',
    },
  };

  try {
    const newClient = await axios.post(`${CLIENTS_URL}/api/admin/users`, clientData, config);
    return newClient;
  } catch (error) {
    return error;
  }
}
