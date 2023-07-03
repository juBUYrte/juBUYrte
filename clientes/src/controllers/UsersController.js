import Users from '../models/User.js';

// const cartaoTest = {
//   numero: '1234432156788765',
//   nome: 'carol fake',
//   validade: '12/30',
//   codigo: '789',
//   vencimento: '12',
// };

// const startCript = (dados) => {
//   const keysCart = Object.keys(dados);
//   const valuesCart = Object.values(dados);
// // };
// startCript(cartaoTest);

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
      const newUser = new Users(req.body);

      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.log(err.name);
      if (err.name == 'ValidationError') {
        return res.status(409).json(err);
      }
      if (err.name == 'MongoServerError') {
        return res.status(409).json(err);
      }
      return res.status(500).json(err);
    }
    return '';
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
