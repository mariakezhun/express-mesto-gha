const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');

router.use(users);
router.use(cards);

router.use("/404", (req, res) =>
  res.status(404).send({ message: "Страница не сущетсвует" })
);

module.exports = router;