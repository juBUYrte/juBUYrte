/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';

class AccountController {
  static _createToken = (id) => {
    const payload = { id };
    const secretKey = process.env.SECRET_KEY;
    const expiration = process.env.EXPIRES_IN;
    const token = jwt.sign(payload, secretKey, { expiresIn: expiration });

    return token;
  };

  static findAccounts = (_req, res) => {
    Account.find((err, allAccounts) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).json(allAccounts);
    });
  };

  static findAccountById = (req, res) => {
    const { id } = req.params;
    Account.findById(id, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!account) {
        return res.status(404).json();
      }
      return res.status(200).json(account);
    });
  };

  static createAccount = async (req, res) => {
    const hasEmail = await Account.findOne({ email: req.body.email });
    if (hasEmail) {
      return res.status(409).send({ message: 'Email already exists' });
    }

    if (!req.body.senha) {
      return res.status(422).send({ message: 'A senha é um campo obrigatório. Favor refazer a operação.' });
    }

    const salt = 12;
    const passwordHash = await bcrypt.hashSync(req.body.senha, salt);

    const account = new Account({
      ...req.body,
      senha: passwordHash,
      createdDate: Date(),
    });

    try {
      await account.save();
      return res.status(201).set('Location', `/admin/accounts/${account.id}`).send(account);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(422).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    }
  };

  static login = async (req, res) => {
    const { email, senha } = req.body;

    const user = await Account.findOne({ email });

    if (!user) {
      return res.status(401).send('Forneça email e senha válidos. Refaça a operação.');
    }

    const validPassword = await bcrypt.compareSync(senha, user.senha);

    if (!validPassword) {
      return res.status(401).send('Forneça email e senha válidos. Refaça a operação.');
    }

    const token = this._createToken(user.id);

    return res.status(204).header('Authorization', `Bearer ${token}`).send();
  };

  static updateAccount = async (req, res) => {
    const { id } = req.params;

    const hasUser = await Account.findById(id);

    if (!hasUser) {
      return res.status(404).send({ message: 'Não há usuário cadastrado com o Id informado.' });
    }

    Account.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).set('Location', `/admin/accounts/${account.id}`).send();
    });
  };

  static deleteAccount = async (req, res) => {
    const { id } = req.params;

    const hasUser = await Account.findById(id);

    if (!hasUser) {
      return res.status(404).send({ message: 'Não há usuário cadastrado com o Id informado.' });
    }

    Account.findByIdAndDelete(id, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).send({ message: 'Account successfully deleted' });
    });
  };
}

export default AccountController;
