import Users from '../models/User.js';

class CardController {
  static validateCard = async (req, res) => {
    try {
      const dadosDoCartao = req.body;
      console.log(dadosDoCartao);
      const resp = await Users.find();
      //   console.log(dadosDoCartao);
      const ensureCard = resp.filter(((user) => user.dadosDoCartao === dadosDoCartao));
      // aqui acho que são 3 = tb
      console.log(ensureCard);
      if (!ensureCard) {
        res.status(400).json({ message: 'Invalid Card' });
      }

      // const idCliente = ensureCard.id
      // console.log(idCliente)

      res.status(200).json('OK validate');
    } catch (err) {
      res.status(500).json(err);
    }
  };

  static getRentById = async (req, res) => {
    try {
      //   const resp = await Users.find({}, { dadosDoCartao: 0 });
      res.status(200).json('OK Rent');
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

export default CardController;
