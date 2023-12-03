const { Router } = require('express');
const gamesRouter = require('./games.router');
const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/games', gamesRouter);

module.exports = router;