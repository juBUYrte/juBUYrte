/* eslint-disable import/no-relative-packages */
import axios from 'axios';
import Users from '../../../clientes/src/models/User';
import Transaction from '../../../transacoes/src/models/Transaction';

const CLIENTS_HOSTNAME = 'localhost';
const CLIENTS_PORT = '3001';
const CLIENTS_URL = `http://${CLIENTS_HOSTNAME}:${CLIENTS_PORT}`;

const TRANSACTION_HOSTNAME = 'localhost';
const TRANSACTION_PORT = '3002';
const TRANSACTION_URL = `http://${TRANSACTION_HOSTNAME}:${TRANSACTION_PORT}`;

export default class TokenGenerator {
  static async clients() {
    const adminRoleAccount = {
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: 'admin',
    };

    let admin = await Users.findOne({ email: adminRoleAccount.email });

    if (!admin) {
      admin = await axios.post(`${CLIENTS_URL}/api/admin/accounts`, adminRoleAccount);
    }

    delete adminRoleAccount.nome;
    const loggedAdminToken = await axios.post(`${CLIENTS_URL}/api/accounts/login`, adminRoleAccount);

    return loggedAdminToken;
  }

  static async transactions() {
    const adminRoleAccount = {
      nome: 'Admin',
      email: 'admin@admin.com',
      senha: 'admin',
    };

    let admin = await Transaction.findOne({ email: adminRoleAccount.email });

    if (!admin) {
      admin = await axios.post(`${TRANSACTION_URL}/api/admin/accounts`, adminRoleAccount);
    }

    delete adminRoleAccount.nome;
    const loggedAdminToken = await axios.post(`${TRANSACTION_URL}/api/accounts/login`, adminRoleAccount);

    return loggedAdminToken;
  }
}
