import Analysis from '../models/Analysis.js';

class AnalysisController {
  static createAnalysis = async (req, res) => {
    const analysisData = req.body;
    const analysis = new Analysis({
      ...analysisData,
      createdDate: Date(),
    });

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
}

export default AnalysisController;
