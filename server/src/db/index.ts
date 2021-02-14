import mongoose from 'mongoose';
import config from '../config';
import {MongoMemoryServer} from 'mongodb-memory-server';

let db: mongoose.Connection;

const opts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connectMongo = async () => {
  console.log(config.serverDatabase);
  await mongoose
    .connect(config.serverDatabase!, opts)
    .catch(err => console.log(err));

  db = mongoose.connection;
};

const connectMemory = async () => {
  mongoose.Promise = Promise;
  const mongoServer = new MongoMemoryServer();

  const mongoUri = await mongoServer.getUri();
  mongoose.connect(mongoUri, opts).catch(err => console.log(err));
};

export const connectDb =
  config.serverDatabase === 'inmemory' ? connectMemory : connectMongo;

export const disconnectDb = () => {
  if (!db) {
    return;
  }

  mongoose.disconnect();
};
