import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';
import config from '@/api-helper/config.json';
var restore = require('mongodb-restore');

export async function mongoSnap(path, restore = false) {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: { uri: config.MONGODB_URI, dbname: "website_db" }
    });
    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: { path: path }
    });
    const transferer = restore ? 
        new MongoTransferer({ source: localfile_connector, targets: [mongo_connector] }) : 
        new MongoTransferer({ source: mongo_connector, targets: [localfile_connector] }) ;
    for await (const { total, write } of transferer) { }
}


export async function restoreSnap(path) {
    await restore({
        uri: config.MONGODB_URI,
        root: path,
        drop: true,
      });
}
