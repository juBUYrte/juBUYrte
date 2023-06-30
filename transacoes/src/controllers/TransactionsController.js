import fetch from 'node-fetch';

import Transaction from '../models/Transaction.js';

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
      const dataCartao = await fetch(
        'http://localhost:3001/api/admin/users/cards',
        {
          method: 'post',
          body: JSON.stringify(dadosDoCartao),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const responseCartao = await dataCartao.json();
      if (responseCartao.message) {
        return res.status(dataCartao.status).json(responseCartao)
      }
      const idUser = responseCartao.id;

      const dataRent = await fetch(
        `http://localhost:3001/api/admin/users/cards/${idUser}`
      );
      const responseRent = await dataRent.json();
      if (responseRent.message) {
        return res.status(dataRent.status).json(responseRent)
      }
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

      // if (status === 'Em análise') {
      //   const idTransaction = response._id.toString();
      //   const { authorization } = req.headers;
      //   const body = { clientId: response.idUser, transactionId: idTransaction }
      //   console.log(body);




      //   const dataAnalysis = await fetch(
      //     'http://localhost:3000/api/admin/analysis',
      //     {
      //       method: 'post',
      //       body: JSON.stringify(),
      //       headers: { 'Content-Type': 'application/json', 'Authorization': authorization }
      //     }
      //   );
      //   // console.log('dataAnalysis: ', dataAnalysis);
      //   // const responseCartao = await dataCartao.json();
      //   // if (responseCartao.message) {
      //   //   return res.status(dataCartao.status).json(responseCartao)
      //   // }
      //   // const idUser = responseCartao.id;
      //   return res.status(303).set('Location', `/api/admin/transactions/${idTransaction}`);
      // }

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
