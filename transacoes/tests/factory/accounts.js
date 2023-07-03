import bcrypt from 'bcryptjs';
import Account from '../../src/models/Account.js';

async function createNewAccount(email = 'teste@teste.com') {
  const newAccount = await Account.create({
    nome: 'teste',
    email,
    senha: 'teste',
  });

  return newAccount;
}

async function createNewHashedAccount(email, password) {
  const salt = 12;
  const passwordHash = await bcrypt.hashSync(password, salt);

  const newAccount = await Account.create({
    nome: 'teste',
    email,
    senha: passwordHash,
  });

  return newAccount;
}

export {
  createNewAccount, createNewHashedAccount,
};
