const axios = require('axios');
const fs = require('fs');
const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

function getAllGames(req, res) {
    pool.query('SELECT * FROM games', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error de traducción' });
        } else {
            res.status(200).json(result.rows);
        }
    });
}

// function getAllGames(req, res) {
//     fs.readFile(path.join(__dirname, '../database/games.json'), 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Error de traducción' });
//         } else {
//             data = corregirAmpersand(data);
//             const games = JSON.parse(data);
//             const salida = [];
//             games.forEach(game => {
//                 salida.push({
//                     name: game.title,
//                     rating: game.rating,
//                     date: game.details.releaseDate,
//                     platforms: game.details.platforms,
//                 });
//             });
//             res.status(200).json(JSON.parse(JSON.stringify(salida)));
//         }
//     });
// }

function corregirAmpersand(data) {
    // Reemplaza "&" con "\u0026" en todas las instancias
    return data.replace(/&/g, '\\u0026');
}

module.exports = { getAllGames };