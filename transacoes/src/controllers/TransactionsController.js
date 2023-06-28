import fetch from 'node-fetch';

import Transaction from '../models/Transaction.js';

class TransactionsController {
  static createTransaction = async (req, res) => {
    // const { valor, dadosDoCartao } = req.body;

    const idUser = '649c85ca9a5d5f5eafed5f00';

    try {
      // const responseCartao = axios.post('http://localhost:3001/') // validar cartao
      // const dataRent = await fetch(`http://localhost:3001/api/admin/users/cards/${idUser}`);
      // const responseRent = await dataRent.json();

      const transaction = new Transaction({
        valor: 123,
        idUser,
        status: 'Em análise',
      });

      await transaction.save();

      return res.status(201);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default TransactionsController;