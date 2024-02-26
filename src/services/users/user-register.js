const path = require('path');
const { conectar } = require('../../database/connection-mongo');
const { createHash } = require('crypto');

async function registerUser(req, res) {
    try {
        const db = await conectar();
        const userDB = db.collection('Users');
        const user = {
            id: createHash('md5').update(req.body.email + new Date()).digest('hex'),
            realName: req.body.realName,
            email: req.body.email,
            username: req.body.username,
            avatar: req.body.avatar,
            uuid: req.body.uuid,
            favoritesGames: [],
            friends: [],
            gamesPlayed: [],
            gamesOwned: [],
            lastConnection: new Date()
        };

        //comprobamos si el usuario ya existe
        const userExists = await userDB.findOne({ email: user.email });
        if (userExists) {
            res.status(400).json({ error: 'El usuario ya existe' });
            return;
        }
        const result = await userDB.insertOne(user);
        res.status(200).json({ message: 'Usuario registrado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'El usuario no se ha podido registrar' });
    }
}


module.exports = { registerUser };