/* eslint-disable import/no-relative-packages */
import axios from 'axios';
import mongoose from 'mongoose';
import TokenGenerator from '../util/tokenGenerator';

const CLIENTS_HOSTNAME = 'localhost';
const CLIENTS_PORT = '3001';
const CLIENTS_URL = `http://${CLIENTS_HOSTNAME}:${CLIENTS_PORT}/api/admin/users`;

const TRANSACTION_HOSTNAME = 'localhost';
const TRANSACTION_PORT = '3002';
const TRANSACTION_URL = `http://${TRANSACTION_HOSTNAME}:${TRANSACTION_PORT}/api/admin/transactions`;

const analysisSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      validate: {
        async validator(val) {
          try {
            const token = await TokenGenerator.clients();
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            const url = `${CLIENTS_URL}/${val}`;
            const response = await axios.get(url, config);
            if (response.status !== 200) {
              return false;
            }

            return response.data;
          } catch (err) {
            return false;
          }
        },
        message: 'O id do cliente deve ser um id válido, ou seja, deve ser referente a um cliente existente.',
      },
    },
    transactionId: {
      type: String,
      required: true,
      validate: {
        async validator(val) {
          try {
            const token = await TokenGenerator.clients();
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            const url = `${TRANSACTION_URL}/${val}`;
            const response = await axios.get(url, config);
            if (response.status !== 200) {
              return false;
            }

            return response.data;
          } catch (err) {
            return false;
          }
        },
        message: 'O id da transação deve ser um id válido, ou seja, deve ser referente a uma tranação existente.',
      },
    },
    status: {
      type: String,
      enum: ['Em Análise', 'Aprovada', 'Rejeitada'],
      default: 'Em Análise',
    },
  },
);

const Analysis = mongoose.model('fraudAnalysis', analysisSchema);

export default Analysis;
