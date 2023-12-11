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
    let query = 'SELECT * FROM games ORDER BY id';

    const page = req.query.page || 1;
    const limit = 20;

    if (page !== 'all') {
        const offset = (page - 1) * limit;
        query += ` LIMIT $1 OFFSET $2`;

        pool.query(query, [limit, offset], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error de traducción' });
            } else {
                res.status(200).json(result.rows);
            }
        });
    } else {
        // Si page es 'all', devolver todos los resultados sin paginación
        pool.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error de traducción' });
            } else {
                res.status(200).json(result.rows);
            }
        });
    }
}


function corregirAmpersand(data) {
    // Reemplaza "&" con "\u0026" en todas las instancias
    return data.replace(/&/g, '\\u0026');
}

module.exports = { getAllGames };