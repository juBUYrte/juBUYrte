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
    nome: 'Ada Lovelace',
    cpf: '12345677910',
    email: 'adalovelace@gmail.com',
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
      numero: '1234432156788745',
      nome: 'Ada Lovelace',
      validade: '2027/12/27',
      codigo: '266',
      vencimento: '18',
    },
  };

  try {
    const newClient = await axios.post(`${CLIENTS_URL}/api/admin/users`, clientData, config);
    console.log(newClient);
    return newClient;
  } catch (error) {
    console.log(error.message);
    return error;
  }
}
