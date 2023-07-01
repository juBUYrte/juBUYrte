/* eslint-disable import/no-relative-packages */
import fetch from 'node-fetch';

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
      email: 'admin@mail.com',
      senha: 'admin',
    };

    await fetch(
      `${CLIENTS_URL}/api/admin/accounts`,
      {
        method: 'post',
        body: JSON.stringify(adminRoleAccount),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    delete adminRoleAccount.nome;
    const loggedAdminToken = await fetch(
      `${CLIENTS_URL}/api/accounts/login`,
      {
        method: 'post',
        body: JSON.stringify(adminRoleAccount),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return loggedAdminToken.headers.get('authorization').split(' ')[1];
  }

  static async transactions() {
    const adminRoleAccount = {
      nome: 'Admin',
      email: 'admin@mail.com',
      senha: 'admin',
    };

    await fetch(
      `${TRANSACTION_URL}/api/admin/accounts`,
      {
        method: 'post',
        body: JSON.stringify(adminRoleAccount),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    delete adminRoleAccount.nome;
    const loggedAdminToken = await fetch(
      `${TRANSACTION_URL}/api/accounts/login`,
      {
        method: 'post',
        body: JSON.stringify(adminRoleAccount),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return loggedAdminToken.headers.get('authorization').split(' ')[1];
  }
}
