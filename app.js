const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/index");

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require("./controllers/users");

const {
  getCard,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
} = require("./controllers/cards");

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

app.use("/*", (req, res) =>
  res.status(404).send({ message: "Страница не сущетсвует" })
);

app.get("/users", getUsers);

app.get("/users/:userId", getUserById);

app.post("/users", createUser);

app.patch("/users/me", updateProfile);

app.patch("/users/me/avatar", updateAvatar);

app.get("/cards", getCard);
app.post("/cards", createCard);
app.delete("/cards/:cardId", deleteCardById);
app.put("/cards/:cardId/likes", putCardLike);
app.delete("/cards/:cardId/likes", deleteCardLike);

// app.use(routes);

app.listen(PORT, () => {
  console.log(`Server run at ${PORT}`);
});
