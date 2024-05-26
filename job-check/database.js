const mongodb = require('mongodb').MongoClient;
const { MONGO_URI, DB_NAME, COLLECTION_NAME } = require('./server.config');


const mongoConnection = mongodb.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.info('MongoDB connection success');
    return client.db(DB_NAME)
   })
  .catch(err => {
    console.error('MongoDB connection fail', err);
    process.exit(1);
  });


module.exports = {
    mongoConnection
};