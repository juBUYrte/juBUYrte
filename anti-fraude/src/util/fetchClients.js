import axios from 'axios';

const CLIENTS_HOSTNAME = 'localhost';
const CLIENTS_PORT = '3001';
const CLIENTS_URL = `http://${CLIENTS_HOSTNAME}:${CLIENTS_PORT}/api/admin/users`

const fetchClient = async(clientId) => {
    try {
        const url = `${CLIENTS_URL}/${clientId}`;
        const response = await axios.get(url);
        if(response.status !== 200) {
            throw new Error(`${response.status} : ${response.data.message}`);
        }

        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export { fetchClient };
