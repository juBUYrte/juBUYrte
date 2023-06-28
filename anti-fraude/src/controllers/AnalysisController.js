/* eslint-disable no-underscore-dangle */
import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import Analysis from '../models/Analysis.js';

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

    analysis.save((err, newAnalysis) => {
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
}

export default AnalysisController;
