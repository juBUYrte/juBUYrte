import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';
import Account from '../models/Account.js';

dotenv.config();
const JWT = process.env.SECRET_KEY;
const EXPIRE = process.env.EXPIRES_IN;

const buscaId = async (id) => {
  const account = await Account.findById(id);
  if (!account) {
    return null;
  }
  return new Account(account);
};

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'senha',
      session: 'false',
    },

    async (email, senha, done) => {
      try {
        const account = await Account.findOne({ email });
        if (!account) {
          return done(null, false, { message: 'Dados inválidos' });
        }
        const compare = await bcrypt.compare(senha, account.senha);
        if (!compare) {
          return done(null, false, { message: 'Dados inválidos' });
        }

        return done(null, account);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new BearerStrategy(
    async (token, done) => {
      try {
        const payload = jwt.verify(token, JWT);
        const accountUserId = await buscaId(payload.id);
        return done(null, accountUserId);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const goToken = (id) => {
  const payload = { id };
  const token = jwt.sign(payload, JWT, { expiresIn: EXPIRE });
  return token;
};
export default goToken;
