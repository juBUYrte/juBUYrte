import axios from 'axios';

const TRANSACTION_HOSTNAME = 'localhost';
const TRANSACTION_PORT = '3001';
const TRANSACTION_URL = `http://${TRANSACTION_HOSTNAME}:${TRANSACTION_PORT}/api/admin/transactions`;

const updateTransaction = async (transactionId, status) => {
  try {
    const url = `${TRANSACTION_URL}/${transactionId}`;
    const dataBody = { status };
    const response = await axios.put(url, dataBody);
    if (response.status !== 200) {
      throw new Error(`${response.status} : ${response.data.message}`);
    }

    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default updateTransaction;
