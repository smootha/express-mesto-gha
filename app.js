const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
// Ограничение колличества запросов
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// Защита от вэб уязвимостей
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const auth = require('./middlewares/auth');

const { NOT_FOUND } = require('./utils/utils');

const { PORT } = require('./config');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'С вашего IP поступило слишком много запросов на сервер. Попробуйте через 5 минут',
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiLimiter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6428852995bf861f4642128c',
  };

  next();
});

app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));

// Авторизация
app.use(auth);
// Роуты доступные после успешной авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

app.listen(PORT, () => {
  console.log('Loaded');
});
