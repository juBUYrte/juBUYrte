import Users from '../models/User.js';

const validaCard = (dadosUser, dadosBody) => {
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
      const userFiltered = users.filter(((user) => {
        if (validaCard(user.dadosDoCartao, dadosDoCartao)) {
          return user;
        }
      }));

      if (userFiltered.length === 0) {
        return res.status(400).json({ message: 'Invalid Card' });
      }
      const data = userFiltered[0].dadosDoCartao.validade;
      const dataBody = data.split('/').reverse();
      const year = Number(dataBody[0]) + 2000;
      const month = dataBody[1];

      const dateCard = new Date(`${year}/${month}`);
      const nowDate = new Date();

      if (dateCard < nowDate) {
        return res.status(400).json({ message: 'Expired  Card' });
      }

      res.status(200).json({ id: userFiltered[0]._id });
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
