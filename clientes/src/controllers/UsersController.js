import Users from '../models/User.js';
import { encrypt } from '../cripto/index.js';

const dadosCriptografados = (dados) => {
  const dadosCartaoKeys = Object.keys(dados);
  const dadosCartaoValues = Object.values(dados);
  const objetoCripto = {};
  dadosCartaoValues.forEach((value, index) => {
    const chave = dadosCartaoKeys[index];
    const encripted = encrypt(value);
    objetoCripto[chave] = encripted;
    objetoCripto._nxt = true;
  });
  return objetoCripto;
};

class UserController {
  static getAll = async (_req, res) => {
    try {
      const resp = await Users.find({}, { dadosDoCartao: 0 });
      return res.status(200).json(resp);
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Users.findById(id, { dadosDoCartao: 0 }).exec();
      if (!resp) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(resp);
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  static async createUser(req, res) {
    try {
      const dadosCartao = dadosCriptografados(req.body.dadosDoCartao);

      req.body.dadosDoCartao = dadosCartao;
      const newUser = new Users(req.body);

      await newUser.save();
      return res.status(201).json(newUser);
    } catch (err) {
      if (err.name == 'ValidationError') {
        return res.status(409).json(err);
      }
      if (err.name == 'MongoServerError') {
        return res.status(409).json(err);
      }
      if (err.name == 'TypeError') {
        return res.status(409).json(err);
      }
      return res.status(500).json(err);
    }
  }

  static deleteById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Users.findByIdAndDelete(id);
      if (!resp) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(204).json(resp);
    } catch (err) {
      return res.status(500).json(err);
    }
  };
}
export default UserController;
