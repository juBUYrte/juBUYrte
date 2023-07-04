import Transaction from '../models/Transaction.js';

import createToken from '../../solutions/token.js';
import { createAnalysis, getClientId, getClientRent } from '../services/TransactionsServices.js';

const HOSTNAME = process.env.TRANSACOES_HOSTNAME || 'localhost';
const PORT = process.env.TRANSACOES_PORT || '3000';
const URL = `http://${HOSTNAME}:${PORT}/api/admin`;

class TransactionsController {
  static getAllTransactions = (_, res) => {
    Transaction.find((err, transactions) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).json(transactions);
    });
  };

  static createTransaction = async (req, res) => {
    const { valor, dadosDoCartao } = req.body;

    if (!valor || !dadosDoCartao) {
      return res.status(422).send({ message: 'Invalid body' });
    }

    try {
      const tokenClient = await createToken(3001, 'clientes');
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
      if (valor >= rent * 0.5) status = 'Em análise';
      if (valor < rent * 0.5) status = 'Aprovada';

      const transaction = new Transaction({ valor, idUser, status });
      const response = await transaction.save();

      if (status === 'Em análise') {
        const idTransaction = response._id.toString();
        const analysis = await createAnalysis(res, response);

        if (!analysis._id) {
          return;
        }

        const token = req.headers.authorization;
        res.set('Location', `/api/admin/transactions/${idTransaction}`);
        res.set('Authorization', token);
        return res.status(303).end();
      }

      return res.status(201).json({ _id: response._id, status });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  static getTransactionById = async (req, res) => {
    const { id } = req.params;

    Transaction.findById(id, async (err, transaction) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!transaction) {
        return res.status(404).json({ message: 'ID not found' });
      }

      const responseBody = {
        _id: transaction._id,
        valor: transaction.valor,
        idUser: transaction.idUser,
        status: transaction.status,
      };

      if (transaction.status === 'Em análise') {
        responseBody._links = {
          self: {
            method: 'GET',
            href: `${URL}/analysis/${transaction._id}`,
          },
          Aprovar: {
            method: 'PATCH',
            obs: 'O método deve ser chamado pela API anti-fraude',
            href: `${URL}/analysis/${transaction._id}`,
            body: { status: 'Aprovada' },
          },
          Rejeitar: {
            method: 'PATCH',
            obs: 'O método deve ser chamado pela API anti-fraude',
            href: `${URL}/analysis/${transaction._id}`,
            body: { status: 'Rejeitada' },
          },
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

      Transaction.findByIdAndUpdate(id, { $set: { status } }, (error) => {
        if (error) {
          return res.status(500).send({ message: error.message });
        }
        return res.sendStatus(204);
      });
    });
  };

  static deleteById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Transaction.findByIdAndDelete(id);
      if (!resp) {
        res.status(400).json({ message: 'User not found' });
      }
      res.status(204).json(resp);
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

export default TransactionsController;
