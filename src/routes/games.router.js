const { Router } = require('express');
const { getAllGames, getGamesByPopularity } = require('../controller/games.controller');
const router = Router();

require('dotenv').config();

router.get('/all-games', getAllGames);
router.get('/games-by-popularity', getGamesByPopularity);

module.exports = router;