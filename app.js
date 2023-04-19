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
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');

const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');

const { NOT_FOUND } = require('./utils/utils');

const { PORT, DB_ADRESS } = require('./config');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'С вашего IP поступило слишком много запросов на сервер. Попробуйте через 5 минут',
});

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiLimiter);

mongoose.connect(DB_ADRESS);

app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));

// Авторизация
app.use(auth);
// Роуты доступные после успешной авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик ошибок celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(errorHandler);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
