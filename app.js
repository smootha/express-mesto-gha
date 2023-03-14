const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const app = express();

app.listen(PORT, () => {
  console.log('Hi');
});