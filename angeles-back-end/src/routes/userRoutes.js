const express = require('express');
const {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').post(registerUser).get(getUsers);
router.post('/login', authUser);
router
  .route('/:id')
  .delete(deleteUser)
  .get(getUserById)
  .put(updateUser);

module.exports = router;