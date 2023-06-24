const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  login,
} = require("../controllers/users");

const {
  createUserValidation,
  loginValidation,
  getUserByIdValidation,
  updateProfileValidation,
  updateAvatarValidation,
} = require("../middlewares/validationJoi");

router.get("/users", getUsers);

router.post("/signup", createUserValidation, createUser);
router.post("/signin", loginValidation, login);

// router.post("/users", createUserValidation, createUser);
router.get("/users/me", getCurrentUser);
router.get("/users/:userId", getUserByIdValidation, getUserById);

router.patch("/users/me", updateProfileValidation, updateProfile);
router.patch("/users/me/avatar", updateAvatarValidation, updateAvatar);

module.exports = router;
