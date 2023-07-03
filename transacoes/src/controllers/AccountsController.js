import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import passport from 'passport';
import fetch from "node-fetch";

import Account from '../models/Account.js';
import goToken from '../authentication/auth.js';

dotenv.config();
class AccountController {
  static loginAccount = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, _) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }
      const token = goToken(user._id);
      return res.status(204).header('Authorization', `Bearer ${token}`).send();
    })(req, res, next);
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
        return res.status(404).json({ message: 'ID not found' });
      }
      return res.status(200).json(account);
    });
  };

  static createAccount = async (req, res) => {
    const { nome, email, senha } = req.body;

    const userEmail = await Account.findOne({ email });
    if (userEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashSenha = await bcrypt.hash(senha, salt);

    const account = new Account({
      nome,
      email,
      senha: hashSenha,
      createdDate: Date(),
    });

    await fetch(
      'http://anti-fraude:3000/api/admin/accounts',
      {
        method: 'post',
        body: JSON.stringify({
          nome,
          email,
          senha: hashSenha,
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    await fetch(
      'http://clientes:3001/api/admin/accounts',
      {
        method: 'post',
        body: JSON.stringify({
          nome,
          email,
          senha: hashSenha,
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    );

    try {
      await account.save();
      return res.status(201).set('Location', `/admin/accounts/${account.id}`).json(account);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  static updateAccount = async (req, res) => {
    const { id } = req.params;

    if (req.body.email) {
      const user = await Account.findOne({ email: req.body.email });
      if (user && user._id.toString() !== id) {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    if (req.body.senha) {
      const salt = 12;
      const hashSenha = bcrypt.hashSync(req.body.senha, salt);
      req.body.senha = hashSenha;
    }

    Account.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!account) {
        return res.status(404).json({ message: 'ID not found' });
      }
      return res.status(204).set('Location', `/admin/accounts/${account.id}`).send();
    });
  };

  static deleteAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndDelete(id, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!account) {
        return res.status(404).json({ message: 'ID not found' });
      }
      return res.status(204).send({ message: 'Account successfully deleted' });
    });
  };
}

export default AccountController;
