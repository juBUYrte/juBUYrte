import mongoose from 'mongoose';

console.log(process.env.NODE_ENV);
const database = process.env.NODE_ENV === 'test' ? 'anti-fraude-test' : 'anti-fraude';
mongoose.connect(`mongodb://admin:secret@${process.env.MONGO_HOST || '127.0.0.1'}:27017/${database}?authSource=admin`);

const db = mongoose.connection;

export default db;
