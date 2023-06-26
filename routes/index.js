const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const auth = require("../middlewares/auth");
const {
  createUser,
  login,
} = require("../controllers/users");

const {
  loginValidation, createUserValidation,
} = require("../middlewares/validationJoi");

router.post("/signin", loginValidation, login);
router.post("/signup", createUserValidation, createUser);
router.use(auth);
router.use(users);
router.use(cards);

router.use('/404', (req, res) => res.status(404).send({ message: 'Страница не сущетсвует' }));

module.exports = router;
