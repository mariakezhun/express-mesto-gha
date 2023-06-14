const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const users = require('./routes/users');
// const cards = require('./routes/cards');

const { getCard } = require("./controllers/cards");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6489dd67b6d89813142c2293",
  };

  next();
});

app.get("/cards", getCard);

// app.use(users);
// app.use(cards);

// app.get('/', (req, res) => {
//   res.send('hello world!');
// })

// app.use('/users', require('./routes/users'));
// app.use('/cards', require('./routes/cards'));

// app.get("/cards", getCard);
// app.post("/cards", createCard);
// app.delete("/cards/:cardId", deleteCardById);
// app.put("/cards/:cardId/likes", putCardLike);
// app.delete("/cards/:cardId/likes", deleteCardLike);

// app.get("/users", getUsers);
// app.post("/users", createUser);
// app.patch("/users/me", updateProfile);
// app.patch("/users/me/avatar", updateAvatar);

app.listen(PORT, () => {
  console.log(`Server run at ${PORT}`);
});
