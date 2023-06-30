import fetch from 'node-fetch';

import Transaction from '../models/Transaction.js';

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

  return 'OK';
}

const getClientId = async (res, dadosDoCartao, tokenClient) => {
  const dataCartao = await fetch('http://localhost:3001/api/admin/users/cards', {
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
  const dataRent = await fetch(`http://localhost:3001/api/admin/users/cards/${idUser}`, {
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
class TransactionsController {
  static getAllTransactions = (_, res) => {
    Transaction.find((err, transactions) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).json(transactions);
    });
  }

  static createTransaction = async (req, res) => {
    const { valor, dadosDoCartao } = req.body;

    try {
      const tokenClient = await createToken(3001);
      if (typeof tokenClient !== 'string') {
        return;
      }

      const idUser = await getClientId(res, dadosDoCartao, tokenClient);
      if (typeof idUser !== 'string') {
        return;
      }

      const rent = await getClientRent(res, idUser, tokenClient);
      if (typeof rent !== 'number') {
        return;
      }

      let status = '';
      valor >= rent * 0.5 ? status = 'Em análise' : status = 'Aprovada';

      const transaction = new Transaction({ valor, idUser, status });
      const response = await transaction.save();

      if (status === 'Em análise') {
        const idTransaction = response._id.toString();
        const analysis = await createAnalysis(res, response);
        if (typeof analysis !== 'string') {
          return;
        }
        return res.status(303).set('Location', `/api/admin/transactions/${idTransaction}`);
      }

      return res.status(201).json({ _id: response._id, status });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  static getTransactionById = (req, res) => {
    const { id } = req.params;

    Transaction.findById(id, (err, transaction) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!transaction) {
        return res.status(404).json({ message: 'ID not found' });
      }
      return res.status(200).json(transaction);
    });
  };

  static updateStatusById = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    Transaction.findById(id, (err, transaction) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!transaction) {
        return res.status(404).json({ message: 'ID not found' });
      }
      if (transaction.status === 'Rejeitada' || transaction.status === 'Aprovada') {
        return res.status(405).send({ message: 'Not allowed' });
      }

      Transaction.findByIdAndUpdate(id, { $set: { status } }, (err, _) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        return res.sendStatus(204);
      });
    });
  }
}

export default TransactionsController;
