// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { PORT = '3000' } = process.env;
const { JWT_SECRET = 'JWT_SECRET' } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
};
