import mongoose from 'mongoose';
import config from '../config';
import {MongoMemoryServer} from 'mongodb-memory-server';

let db: mongoose.Connection;
let mongoServer: MongoMemoryServer;

const opts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connectMongo = async () => {
  await mongoose
    .connect(config.serverDatabase!, opts)
    .catch(err => console.log(err));

  db = mongoose.connection;
};

const connectMemory = async () => {
  mongoose.Promise = Promise;
  mongoServer = new MongoMemoryServer();

  const mongoUri = await mongoServer.getUri();
  mongoose.connect(mongoUri, opts).catch(err => console.log(err));
  db = mongoose.connection;
};

export const connectDb =
  config.serverDatabase === 'inmemory' ? connectMemory : connectMongo;

export const disconnectDb = async () => {
  if (!db) {
    return;
  }

  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};
