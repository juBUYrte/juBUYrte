import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    _id: { type: String },
    valor: { type: Number, required: true },
    idUser: { type: String, ref: 'users', required: true },
    status: { type: String, enum: ['Aprovada', 'Em análise', 'Rejeitada'], required: true },
  },
);

const Transaction = mongoose.model('transactions', transactionSchema);

export default Transaction;
