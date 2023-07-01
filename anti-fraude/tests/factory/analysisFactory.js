import Analysis from '../../src/models/Analysis';

async function createRejectedAndApprovedAnalysis(clientId, transactionId) {
  const analysisList = await Analysis.insertMany([
    {
      clientId,
      transactionId,
      status: 'Rejeitada',
    },
    {
      clientId,
      transactionId,
      status: 'Rejeitada',
    },
    {
      clientId,
      transactionId,
      status: 'Aprovada',
    },
    {
      clientId,
      transactionId,
      status: 'Aprovada',
    },
  ]);

  return analysisList;
}

async function createUnderReviewAnalysis(clientId, transactionId) {
  const analysisList = await Analysis.insertMany([
    {
      clientId,
      transactionId,
      status: 'Em análise',
    },
    {
      clientId,
      transactionId,
      status: 'Em análise',
    },
    {
      clientId,
      transactionId,
      status: 'Em análise',
    },
    {
      clientId,
      transactionId,
      status: 'Em análise',
    },
    {
      clientId,
      transactionId,
      status: 'Aprovada',
    },
    {
      clientId,
      transactionId,
      status: 'Rejeitada',
    },
  ]);

  return analysisList;
}

export { createRejectedAndApprovedAnalysis, createUnderReviewAnalysis };
