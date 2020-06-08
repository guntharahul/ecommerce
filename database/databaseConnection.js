const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
};
const { MONGO_USER, MONGO_DB, MONGO_PASSWORD } = process.env;

const dbConnectionURL = {
  MONGO_ATLAS_CONNECTION_URL: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-kxz9p.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
};

mongoose.connect(dbConnectionURL.MONGO_ATLAS_CONNECTION_URL, options);
const db = mongoose.connection;
db.on(
  'error',
  console.error.bind(
    console,
    'Mongodb Connection Error:' + dbConnectionURL.MONGO_ATLAS_CONNECTION_URL
  )
);
db.once('open', () => {
  // we're connected !
  console.log('Database Connection Successful');
});

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-kxz9p.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
//     {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => console.log('Database connected'))
//   .catch((err) => {
//     console.log(err);
//   });
