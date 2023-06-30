/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-relative-packages */
import Transaction from '../../../transacoes/src/models/Transaction.js';
import createNewCliente from './clientFactory.js';

export default async function createNewTransaction() {
  const newUser = await createNewCliente();
  const validClientData = {
    valor: 2000,
    idUser: newUser._id.toHexString(),
    status: 'Em análise',
  };
  const newTransaction = await Transaction.create(validClientData);

  return newTransaction;
}
