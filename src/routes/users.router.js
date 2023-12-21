const { Router } = require('express');
const { addUser, getAllUsers } = require('../controller/users/users.controller');
const router = Router();

require('dotenv').config();

router.post('/add-user', addUser);
router.get('/all-users', getAllUsers);

module.exports = router;