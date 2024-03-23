const router = require('express').Router();
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getOneUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendsId (post & delete)
router.route('/:userId/friends/:friendsId').post(createFriend).delete(deleteFriend);

module.exports = router;