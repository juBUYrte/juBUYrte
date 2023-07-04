import { decrypt } from '../cripto/index.js';
import Users from '../models/User.js';

const validaCard = (dadosUser, dadosBody) => {
  const {
    numero, nome, validade, codigo,
  } = dadosUser;

  const newObject = {
    numero,
    nome,
    validade,
    codigo,
  };
  const keysUser = Object.keys(newObject);
  const valuesUser = Object.values(newObject);

  const keysBody = Object.keys(dadosBody);
  const valuesBody = Object.values(dadosBody);
  const ensureKeys = keysUser.every(((key) => keysBody.includes(key)));
  const ensureValues = valuesUser.every(((value) => valuesBody.includes(value)));

  if (!ensureKeys) {
    throw new Error('Required keys : numero , nome , validade , codigo ');
  }

  if (ensureKeys && ensureValues) {
    return true;
  }
  return false;
};

const dadosDesCriptografados = (dados) => {
  const dadosCartaoKeys = Object.keys(dados);
  const dadosCartaoValues = Object.values(dados);

  const dadosCartaoKeysSemNxt = dadosCartaoKeys.filter((key) => key !== '_nxt' && key !== 'vencimento');

  const objetoCripto = {};

  dadosCartaoKeysSemNxt.forEach((key, index) => {
    const value = dadosCartaoValues[index];
    objetoCripto[key] = decrypt(value);
    objetoCripto._nxt = 'true';
  });
  return objetoCripto;
};

class CardController {
  static validateCard = async (req, res) => {
    try {
      const dadosDoCartaoBody = req.body;
      const users = await Users.find();
      const userFiltered = users.filter(((user) => {
        if (user.dadosDoCartao._nxt) {
          const iv = dadosDesCriptografados(user.dadosDoCartao);
          if (validaCard(iv, dadosDoCartaoBody)) {
            return user;
          }
        }
        if (validaCard(user.dadosDoCartao, dadosDoCartaoBody)) {
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

      return res.status(200).json({ id: userFiltered[0]._id });
    } catch (err) {
      if (err.message === 'Required keys : numero , nome , validade , codigo ') {
        return res.status(409).json({ message: err.message });
      }
      return res.status(500).json(err);
    }
  };

  static getRentById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Users.findById(id);
      if (!resp) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json({ rent: resp.rendaMensal });
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(500).json(err);
    }
  };
}

export default CardController;
