const path = require('path');
const { Pool } = require('pg');
const { exit } = require('process');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

function registerUser(req, res) {
    const { username, realName, email, avatar, uuid } = req.body;
    const isAdmin = false;
    const myGames = '{}';
    const myWishlist = '{}';
    const friends = '{}';

    console.log(req.body);

    const query = `
        INSERT INTO users (username, realName, email, avatar, uuid, isAdmin, myGames, myWishlist, friends)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`;

    pool.query(query, [username, realName, email, avatar, uuid, isAdmin, myGames, myWishlist, friends], (err, result) => {
        if (err) {
            console.error(err);
            if (err.code === '23505') {
                return res.status(404).json({ error: 'El usuario ya existe' });
            }
            return res.status(400).json({ error: 'No se ha podido crear el usuario' });
        } else {
            return res.status(200).json(result.rows);
        }
    });
}


module.exports = { registerUser };