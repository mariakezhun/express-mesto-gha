const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const auth = require("./middlewares/auth");
const { errors } = require('celebrate');
// const cookieParser = require('cookie-parser')

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

const app = express();

// app.use(cookieParser());

app.use(bodyParser.json());
app.use(errors())

// app.post("/signin", login);
// app.post("/signup", createUser);
app.use(auth);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server run at ${PORT}`);
});
