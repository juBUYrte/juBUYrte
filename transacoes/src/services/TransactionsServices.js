import fetch from 'node-fetch';
import createToken from '../../solutions/token.js';

const createAnalysis = async (res, transaction) => {
  const tokenAntiFraude = await createToken(3000);
  const clientId = transaction.idUser;
  const transactionId = transaction._id.toString();

  const body = { clientId, transactionId };

  const data = await fetch(
    'http://localhost:3000/api/admin/analysis',
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'Authorization': tokenAntiFraude }
    }
  );

  const responseAnalise = await data.json();

  if (responseAnalise.message) {
    return res.status(data.status).json(responseAnalise)
  }

  return responseAnalise;
}

const getClientId = async (res, dadosDoCartao, tokenClient) => {
  const dataCartao = await fetch('http://localhost:8080/clientes/api/admin/users/cards', {
    method: 'post',
    body: JSON.stringify(dadosDoCartao),
    headers: { 'Content-Type': 'application/json', 'Authorization': tokenClient }
  });

  const responseCartao = await dataCartao.json();

  if (responseCartao.message) {
    return res.status(dataCartao.status).json(responseCartao);
  }

  const idUser = responseCartao.id;
  return idUser;
}

const getClientRent = async (res, idUser, tokenClient) => {
  const dataRent = await fetch(`http://localhost:8080/clientes/api/admin/users/cards/${idUser}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': tokenClient
    }
  });

  const responseRent = await dataRent.json();

  if (responseRent.message) {
    return res.status(dataRent.status).json(responseRent);
  }

  const rent = responseRent.rent;
  return rent;
}

const getAnalysisId = async (res, transactionId) => {
  const tokenAntiFraude = await createToken(3000);
  const formatedTransactionId = transactionId.toString();

  const data = await fetch('http://localhost:3000/api/admin/analysis', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': tokenAntiFraude
    }
  });

  const response = await data.json();
  const filter = response.find(item => item.transactionId == formatedTransactionId);
  console.log('filter? ', filter);
  console.log('response? ', response);
  console.log('formatedTransactionId? ', formatedTransactionId);

  if (response.message) {
    return res.status(data.status).json(response);
  }
  return response.id;
}

export { createAnalysis, getClientId, getClientRent, getAnalysisId };