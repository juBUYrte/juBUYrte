import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import passport from 'passport';

import Account from '../models/Account.js';
import goToken from '../authentication/auth.js';

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
    const salt = 12;
    const hasPassword = bcrypt.hashSync(req.body.senha, salt);
    req.body.senha = hasPassword;

    const account = new Account({
      ...req.body,
      createdDate: Date(),
    });
    account.save((err, newAccount) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).set('Location', `/admin/accounts/${account.id}`).json(newAccount);
    });
  };

  static updateAccount = (req, res) => {
    const { id } = req.params;
    if (req.body.senha) {
      const salt = 12;
      const hasPassword = bcrypt.hashSync(req.body.senha, salt);
      req.body.senha = hasPassword;
    }

    Account.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, account) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).set('Location', `/admin/accounts/${account.id}`).send();
    });
  };

  static deleteAccount = (req, res) => {
    const { id } = req.params;

    Account.findByIdAndDelete(id, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(204).send({ message: 'Account successfully deleted' });
    });
  };
}

export default AccountController;
