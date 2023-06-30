import axios from 'axios';
import jwt from 'jsonwebtoken';
import Analysis from '../src/models/Analysis';
import TokenGenerator from '../src/util/tokenGenerator';

const CLIENTS_HOSTNAME = 'localhost';
const CLIENTS_PORT = '3001';
const CLIENTS_URL = `http://${CLIENTS_HOSTNAME}:${CLIENTS_PORT}`;

async function cleanAnalysisDB() {
  await Analysis.deleteMany({});
}

async function deleteCreatedClient(id) {
  const token = await TokenGenerator.clients();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(`${CLIENTS_URL}/api/admin/users/${id}`, config);
}

function createValidToken(userId) {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY);
  return token;
}

export { cleanAnalysisDB, createValidToken, deleteCreatedClient };
