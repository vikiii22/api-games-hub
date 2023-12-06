const { Router } = require('express');
const { getAllGames } = require('../controller/games.controller');
const router = Router();

require('dotenv').config();

router.get('/all-games', getAllGames);

module.exports = router;