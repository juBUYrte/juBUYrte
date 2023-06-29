/* eslint-disable no-underscore-dangle */
import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import Analysis from '../models/Analysis.js';
import fetchClient from '../util/fetchClients.js';
import updateTransaction from '../util/fetchTransaction.js';

class AnalysisController {
  static _verifyAnalysis = async (id) => {
    const analysis = await Analysis.findById(id);

    if (!analysis) throw NotFoundError('Não há quaisquer produtos com o id informado. Por gentileza, refaça a operação.');
    if (analysis.status === 'Em Análise' || analysis.status === 'Rejeitada') throw UnauthorizedError('Não é possível deletar uma análise que ainda está sob revisão ou possui status "Rejeitada".');

    return analysis;
  };

  static createAnalysis = async (req, res) => {
    const analysisData = req.body;
    const analysis = new Analysis({
      ...analysisData,
      createdDate: Date(),
    });

    try {
      await fetchClient(analysis.clientId);
    } catch (err) {
      return res.status(500).send({ message: 'ClientID não encontrada nos serviços de clients' });
    }

    await analysis.save((err, newAnalysis) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).set('Location', `api/admin/analysis/${analysis.id}`).send(newAnalysis);
    });
  };

  static findUnderReviewAnalysis = async (_req, res) => {
    const statusParameter = 'Em Análise';

    try {
      const underReviewAnalysisList = await Analysis.find({ status: statusParameter });
      return res.status(200).send(underReviewAnalysisList);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  static deleteAnalysis = async (req, res) => {
    const { id } = req.params;

    try {
      const analysis = await this._verifyAnalysis(id);
      await Analysis.deleteOne(analysis);
      return res.status(200).send(analysis);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(422).send({ message: 'O id informado é inválido, favor informe um id compatível com o tipo ObjectID' });
      }
      return res.status(error.status || 500).send({ message: error.message });
    }
  };
  
  static findWithDetailsById = async (req, res) => {
    const { id } = req.params;

    try {
      const analysis = await Analysis.findById(id);

      if (!analysis) {
        return res.status(404).json();
      }

      const dadosUsuario = await fetchClient(analysis.clientId);
      return res.status(200).json({ analysis, dadosUsuario });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  static updateAnalysisAndTransaction = async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      try {
        const analysis = await Analysis.findById(id);

        if(!analysis) {
          return res.status(404).send({ message: 'Nenhuma analise encontrada com o ID informado'});
        }

        if(!(analysis.status === 'Em Análise')) {
          return res.status(400).send({ message: `O status da análise esta '${analysis.status}' e não pode ser atualizado.`});
        }

        await Analysis.findByIdAndUpdate(id, {$set: {status: status}});
        await updateTransaction(analysis.transactionId, status);
        
        return res.status(204).set('Location', `/admin/analysis/${analysis._id}`).send();
      } catch (error) {
        return res.status(500).send({ message: error.message});
      }
  }
}

export default AnalysisController;
