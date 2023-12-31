import mongoose from 'mongoose';

const database = process.env.NODE_ENV === 'test' ? 'transacoes-test' : 'transacoes';
mongoose.connect(`mongodb://admin:secret@${process.env.MONGO_HOST || '127.0.0.1'}:27017/${database}?authSource=admin`);

const db = mongoose.connection;

export default db;
