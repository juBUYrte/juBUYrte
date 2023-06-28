import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
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
