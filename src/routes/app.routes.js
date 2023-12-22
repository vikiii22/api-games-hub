const { Router } = require('express');
const gamesRouter = require('./games.router');
const usersRouter = require('./users.router');
const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/games', gamesRouter);
router.use('/users', usersRouter);


module.exports = router;