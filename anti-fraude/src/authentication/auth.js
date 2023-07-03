import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';
import Account from '../models/Account.js';

dotenv.config();
const JWT = process.env.SECRET_KEY;

const buscaId = async (id) => {
  const account = await Account.findById(id);
  if (!account) {
    return null;
  }
  return new Account(account);
};

export default function inicializarPassport() {
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
}
