import Transaction from '../models/Transaction.js';

import createToken from '../../solutions/token.js';
import { createAnalysis, getClientId, getClientRent } from '../services/TransactionsServices.js';

const HOSTNAME = process.env.TRANSACOES_HOSTNAME || 'localhost';
const PORT = process.env.TRANSACOES_PORT || '3002';
const URL = `http://${HOSTNAME}:${PORT}/api/admin`;

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

        const token = req.headers.authorization;
        res.set('Location', `/api/admin/transactions/${idTransaction}`)
        res.set('Authorization', token);
        return res.status(303).end();
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
      let responseBody = {
        _id: transaction._id,
        valor: transaction._id,
        idUser: transaction.idUser,
        status: transaction.status,
      };

      if (transaction.status === 'Em análise') {
        responseBody._links = {
          "self": {
            method: 'GET',
            href: `${URL}/transactions/${transaction._id}`,
          },
          "Aprovar": {
            method: 'PATCH',
            obs: 'O método deve ser chamado pela API anti-fraude',
            href: `${URL}/transactions/${transaction._id}`,
            body: { status: 'Aprovada' }
          },
          "Rejeitar": {
            method: 'PATCH',
            obs: 'O método deve ser chamado pela API anti-fraude',
            href: `${URL}/transactions/${transaction._id}`,
            body: { status: 'Rejeitada' }
          }
        };
      }
      return res.status(200).json(responseBody);
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
