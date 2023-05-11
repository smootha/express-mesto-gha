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
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const { PORT, DB_ADRESS } = require('./config');

const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NotFoundError } = require('./middlewares/NotFoundError');
// Настройки лимитера запросов
const { limiterSettings } = require('./utils/limiterSettings');

const app = express();
const apiLimiter = rateLimit(limiterSettings);

app.use(helmet());
app.use(cors({ origin: `http://localhost:${PORT}` }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiLimiter);
// Подключение к базе данных
mongoose.connect(DB_ADRESS);
// Подключение логгера запросов
app.use(requestLogger);
// Роуты доступные до авторизации
app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));
// Авторизация
app.use(auth);
// Роуты доступные после успешной авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
// Обработка некорректных роутов
app.use('*', () => {
  throw new NotFoundError('Страница не найдена!');
});

// Подключение логгера ошибок
app.use(errorLogger);
// Обработчик ошибок celebrate
app.use(errors());
// Централизованный обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
