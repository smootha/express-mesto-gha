// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { PORT = '3001' } = process.env;
const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const { DB_ADRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  DB_ADRESS,
};
