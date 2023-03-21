const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./utils/utils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
