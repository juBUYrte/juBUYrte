import Account from '../../src/models/Account';

export default async function createNewAccount() {
  const newAccount = await Account.create({
    nome: 'teste',
    email: 'teste@teste.com',
    senha: 'teste',
  });

  return newAccount;
}
