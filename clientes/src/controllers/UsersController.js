import crypto from 'crypto';
import Users from '../models/User.js';
// const crypto = require('crypto');
const DADOS_CRIPTOGRAFAR = {
  algoritmo: 'aes256',
  segredo: 'chaves',
  tipo: 'hex',
};
const cipher = crypto.createCipheriv(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);

class UserController {
  static getAll = async (_req, res) => {
    try {
      const resp = await Users.find({}, { dadosDoCartao: 0 });
      res.status(200).json(resp);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Users.findById(id, { dadosDoCartao: 0 }).exec();
      if (!resp) {
        res.status(400).json({ message: 'User not found' });
      }
      res.status(200).json(resp);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  static async createUser(req, res) {
    try {
      const newUser = new Users(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static deleteById = async (req, res) => {
    try {
      const { id } = req.params;
      const resp = await Users.findByIdAndDelete(id);
      if (!resp) {
        res.status(400).json({ message: 'User not found' });
      }
      res.status(204).json(resp);
    } catch (err) {
      res.status(500).json(err);
    }
  };
}
const criptogragia = (dado) => {
  cipher.update(dado);
  return cipher.final();
};

// console.log(criptogragia('ABOBORA'));

export default UserController;
