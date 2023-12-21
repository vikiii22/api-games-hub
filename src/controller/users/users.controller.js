const path = require('path');
const { Pool } = require('pg');
const { registerUser } = require('../../services/users/user-register');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

function addUser(req, res) {
    registerUser(req, res);
}

function getAllUsers(req, res) {
    const query = 'SELECT * FROM users ORDER BY id';

    const page = req.query.page || "all";
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

module.exports = { addUser, getAllUsers };

