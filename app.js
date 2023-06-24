const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const auth = require("./middlewares/auth");
const { errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const {
  createUserValidation,
  loginValidation,
} = require("./middlewares/validationJoi");
// const cookieParser = require('cookie-parser')

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

const app = express();
app.use(errors());

// app.use(cookieParser());

app.use(bodyParser.json());
app.post("/signin", loginValidation, login);
app.post("/signup", createUserValidation, createUser);
app.use(auth);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server run at ${PORT}`);
});
