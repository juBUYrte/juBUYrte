import axios from 'axios';
import TokenGenerator from './tokenGenerator.js';

const CLIENTS_HOSTNAME = 'clientes';
const CLIENTS_PORT = '3001';
const CLIENTS_URL = `http://${CLIENTS_HOSTNAME}:${CLIENTS_PORT}/api/admin/users`;

const fetchClient = async (clientId) => {
  const token = await TokenGenerator.clients();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const url = `${CLIENTS_URL}/${clientId}`;
    const response = await axios.get(url, config);
    if (response.status !== 200) {
      throw new Error(`${response.status} : ${response.data.message}`);
    }
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default fetchClient;
