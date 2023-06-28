import fetch from 'node-fetch';

import Transaction from '../models/Transaction.js';

class TransactionsController {
  static createTransaction = async (req, res) => {
    const { valor, dadosDoCartao } = req.body;

    try {
      const dataCartao = await fetch(
        'http://localhost:3001/api/admin/users/cards',
        {
          method: 'post',
          body: JSON.stringify(dadosDoCartao),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const responseCartao = await dataCartao.json();
      const idUser = responseCartao.id;

      const dataRent = await fetch(
        `http://localhost:3001/api/admin/users/cards/${idUser}`
      );
      const responseRent = await dataRent.json();
      const rent = responseRent.rent;

      let status = '';

      if (valor >= rent * 0.5) {
        status = 'Em análise';
      } else {
        status = 'Aprovada';
      }

      const transaction = new Transaction({
        valor,
        idUser,
        status
      });

      const response = await transaction.save();

      return res.status(201).json({ _id: response._id, status });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static getTransactionById = async (req, res) => {
    const { id } = req.params;

    try {
      const response = await Transaction.findById(id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ message: 'ID not found' });
    }
  };

  static updateStatusById = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const transaction = await Transaction.findById(id);

      if (transaction.status === 'Rejeitada' || transaction.status === 'Aprovada') {
        return res.status(401).send({ message: 'Not allowed' });
      }

      await Transaction.findByIdAndUpdate(id, { $set: { status } });

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default TransactionsController;
