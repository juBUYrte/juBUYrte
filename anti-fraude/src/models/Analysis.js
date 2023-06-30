/* eslint-disable import/no-relative-packages */
import mongoose from 'mongoose';
import User from '../../../clientes/src/models/User.js';
import Transaction from '../../../transacoes/src/models/Transaction.js';

const analysisSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      validate: {
        async validator(val) {
          try {
            const validClient = await User.findById(val);
            return validClient;
          } catch (error) {
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
            const validTransaction = await Transaction.findById(val);
            return validTransaction;
          } catch (error) {
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
