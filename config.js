// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

// С рассчетом на будущее сделал запрос значений из несуществуюшего .env файла
const { PORT = '3000' } = process.env;
const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const { DB_ADRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  DB_ADRESS,
};
