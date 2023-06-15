const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6489dd67b6d89813142c2293',
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server run at ${PORT}`);
});
