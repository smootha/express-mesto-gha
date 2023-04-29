// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

// С рассчетом на будущее сделал запрос значений из несуществуюшего .env файла
const { PORT = '3000' } = process.env;
const { JWT_SECRET = '944da6c9e36606d6274af0be02b1c9217eba92989c35a24d9e5ce517262f72cb' } = process.env;
const { DB_ADRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  DB_ADRESS,
};
