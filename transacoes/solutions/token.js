import fetch from 'node-fetch';

const createToken = async (port, host) => {
  const admin = {
    nome: 'admin',
    email: 'admin@mail.com',
    senha: 'admin',
  };

  const login = {
    email: admin.email,
    senha: admin.senha,
  };

  await fetch(
    `http://${host}:${port}/api/admin/accounts`,
    {
      method: 'post',
      body: JSON.stringify(admin),
      headers: { 'Content-Type': 'application/json' }
    }
  );

  const response = await fetch(
    `http://${host}:${port}/api/accounts/login`,
    {
      method: 'post',
      body: JSON.stringify(login),
      headers: { 'Content-Type': 'application/json' }
    }
  );

  let token = response.headers.get('authorization');

  return token;
};
export default createToken;
