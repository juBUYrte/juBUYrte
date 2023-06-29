import Analysis from '../src/models/Analysis';

async function cleanAnalysisDB() {
  await Analysis.deleteMany({});
}

export default cleanAnalysisDB;
