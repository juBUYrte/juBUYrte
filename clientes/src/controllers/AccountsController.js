/* eslint-disable import/no-cycle */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import passport from 'passport';
import Account from '../models/Account.js';
import goToken from '../authentication/auth.js';
import createTokenClient from '../../solutions/token.js';

dotenv.config();

class AccountController {
  static loginAccount = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(400).json({ message: info.message });
      }
      const token = goToken(user._id);
      return res.status(204).header('Authorization', `Bearer ${token}`).send();
    })(req, res, next);
  };

  static findAccounts = async (_req, res) => {
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
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(409).json({ message: 'Required "nome" , "email" , "senha".' });
    }
    const userEmail = await Account.findOne({ email });
    if (userEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(12);

    const hastSenha = await bcrypt.hash(senha, salt);
    const account = new Account({
      nome,
      email,
      senha: hastSenha,
      createdDate: Date(),
    });

    try {
      await account.save();
      return res.status(201).json(account);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  static updateAccount = async (req, res) => {
    const { id } = req.params;
    const emailBody = req.body.email;

    if (emailBody) {
      const userEmail = await Account.findOne({ email: emailBody });
      if (userEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    Account.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, account) => {
      if (!account) {
        return res.status(404).send({ message: 'Not found' });
      }
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).send();
    });
    return '';
  };

  static deleteAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndDelete(id, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!account) {
        return res.status(404).json();
      }
      return res.status(204).send({ message: 'Account successfully deleted' });
    });
  };
}

export default AccountController;
