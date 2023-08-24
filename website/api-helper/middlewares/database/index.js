import { MongoClient } from 'mongodb';
import config from '../../config.json';
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 * https://github.com/vercel/next.js/pull/17666
 */
global.mongo = global.mongo || {};
const uri = config.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}
let indexesCreated = false;
async function createIndexes(db) {
  await Promise.all([
    db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
    ]),
  ]);
  indexesCreated = true;
}

export async function getMongoClient() {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(uri, options);
  }


  await global.mongo.client.connect();
  return global.mongo.client;
}

export default async function database(req, res, next) {


  req.dbClient = await getMongoClient();
  req.db = req.dbClient.db();
  if (!indexesCreated) await createIndexes(req.db);


  return next();
}
