const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');

router.use(users);
router.use(cards);

module.exports = router;