import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ensureTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  const tokenJWT = token.split(' ')[1];
  jwt.verify(tokenJWT, process.env.SECRET_KEY, (error) => {
    if (error) {
      return res.status(401).json({ message: error.message });
    }

    return next();
  });
  return '';
};
export default ensureTokenMiddleware;
