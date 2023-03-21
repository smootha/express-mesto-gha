const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
// Ограничение колличества запросов
// eslint-disable-next-line import/no-extraneous-dependencies
// const rateLimit = require('express-rate-limit');
// Защита от вэб уязвимостей
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');

const { NOT_FOUND } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();
/*
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'С вашего IP поступило слишком много запросов на сервер. Попробуйте через 5 минут',
});
*/
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(apiLimiter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6417a68eba64fae82593db0e',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

app.listen(PORT, () => {
  console.log('Loaded');
});
