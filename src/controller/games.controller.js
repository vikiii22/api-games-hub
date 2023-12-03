const axios = require('axios');
const fs = require('fs');
const path = require('path');

function getAllGames(req, res) {
    fs.readFile(path.join(__dirname, '../database/games.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error de traducción' });
        } else {
            data = corregirAmpersand(data);
            res.status(200).json(JSON.parse(data));
        }
    });
}

function corregirAmpersand(data) {
    // Reemplaza "&" con "\u0026" en todas las instancias
    return data.replace(/&/g, '\\u0026');
}

module.exports = { getAllGames };