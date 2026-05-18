const mongoose = require('mongoose');

global.Promise = Promise;

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000
  });

  return conn;
}

module.exports = connectDB;

