import jwt from 'jsonwebtoken';
import Analysis from '../src/models/Analysis';

async function cleanAnalysisDB() {
  await Analysis.deleteMany({});
}

function createValidToken(userId) {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY);
  return token;
}

export { cleanAnalysisDB, createValidToken };
