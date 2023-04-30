const limiterSettings = {
  windowMs: 5 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'С вашего IP поступило слишком много запросов на сервер. Попробуйте через 5 минут',
};

module.exports = { limiterSettings };
