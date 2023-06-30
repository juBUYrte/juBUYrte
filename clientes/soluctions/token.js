import request from 'supertest';
import app from '../src/app.js';
import Account from '../src/models/Account.js';

const createTokenClient = async () => {
  const admin = {
    nome: 'admin',
    email: 'admin@mail.com',
    senha: 'admin',
  };
  const ensureAdmin = await Account.findOne({ email: admin.email });
  if (!ensureAdmin) {
    await request(app)
      .post('/api/admin/accounts')
      .send(admin);

    const loginAdmin = await request(app)
      .post('/api/accounts/login')
      .send({
        email: 'admin@mail.com',
        senha: 'admin',
      });
    const token = loginAdmin.headers.authorization.split(' ')[1];
    return token;
  }
  const loginAdmin = await request(app)
    .post('/api/accounts/login')
    .send({
      email: 'admin@mail.com',
      senha: 'admin',
    });
  const token = loginAdmin.headers.authorization.split(' ')[1];
  return token;
};
export default createTokenClient;
