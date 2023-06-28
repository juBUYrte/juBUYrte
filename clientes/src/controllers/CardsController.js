import Users from '../models/User.js';

const validaCard = async (dadosUser, dadosBody) => {
  const objetosKeys1 = Object.keys(dadosUser);
  const objetosKeys2 = Object.keys(dadosBody);
  const objetosValues1 = Object.values(dadosUser);
  const objetosValues2 = Object.values(dadosBody);

  const resulQntKeys = [];
  objetosKeys1.forEach(((key) => {
    if (objetosKeys2.includes(key)) {
      resulQntKeys.push(key);
    }
  }));

  const resulQntValues = [];
  objetosValues1.forEach(((value) => {
    if (objetosValues2.includes(value)) {
      resulQntValues.push(value);
    }
  }));
  const we = resulQntKeys.length === 4;
  const re = resulQntValues.length === 4;

  if (we && re) {
    return true;
  }
  return false;
};

class CardController {
  static validateCard = async (req, res) => {
    try {
      const dadosDoCartao = req.body;
      const users = await Users.find();
      const userId = users.filter((async (user) => {
        if (await validaCard(user.dadosDoCartao, dadosDoCartao)) {
          return user;
        }
      }));
      if (userId.length === 0) {
        res.status(400).json({ message: 'Invalid Card' });
      }

      res.status(200).json({ id: userId[0]._id });
    } catch (err) {
      res.status(500).json(err);
    }
  };

  static getRentById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Users.findById(id);
      res.status(200).json({ rent: resp.rendaMensal });
    } catch (err) {
      res.status(500).json(err);
    }
  };
}

export default CardController;
