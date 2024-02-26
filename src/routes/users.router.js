const { Router } = require('express');
const { addUser, getAllUsers, getUser, updateUser, getFavouriteGames } = require('../controller/users/users.controller');
const router = Router();

require('dotenv').config();

router.post('/add-user', addUser);
router.get('/all-users', getAllUsers);
router.get('/user', getUser);
router.put('/update-user', updateUser);
router.get('/favorite-games', getFavouriteGames); 

module.exports = router;