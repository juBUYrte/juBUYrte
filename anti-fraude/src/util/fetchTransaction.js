import axios from 'axios';
import TokenGenerator from './tokenGenerator';

const TRANSACTION_HOSTNAME = 'localhost';
const TRANSACTION_PORT = '3002';
const TRANSACTION_URL = `http://${TRANSACTION_HOSTNAME}:${TRANSACTION_PORT}/api/admin/transactions`;

const updateTransaction = async (transactionId, status) => {
  const token = await TokenGenerator.transactions();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  try {
    const url = `${TRANSACTION_URL}/${transactionId}`;
    const dataBody = { status };
    const response = await axios.patch(url, dataBody, config);
    if (response.status !== 200) {
      throw new Error(`${response.status} : ${response.data.message}`);
    }

    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default updateTransaction;
