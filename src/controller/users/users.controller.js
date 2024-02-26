const path = require('path');
const { Pool } = require('pg');
const { conectar } = require('../../database/connection-mongo');
const { registerUser } = require('../../services/users/user-register');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

async function createConnection() {
    const db = await conectar();
    const userDB = db.collection('Users');
    return userDB;
}

function addUser(req, res) {
    registerUser(req, res);
}

async function getAllUsers(req, res) {
    const userDB = await createConnection();
    try{
        userDB.find(
            { },
            { projection: { _id: 0 }}
        ).toArray()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}

async function getUser(req, res) {
    const userDB = await createConnection();
    try{
        userDB.findOne(
            { email: req.query.email },
            { projection: { _id: 0 }}
        )
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el usuario' });
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}

async function updateUser(req, res) {
    const userDB = await createConnection();
    try{
        const udpteFields = { ...req.body };
        delete udpteFields.id;
        delete udpteFields.email;
        delete udpteFields.favoritesGames;
        delete udpteFields.friends;
        delete udpteFields.gamesPlayed;
        delete udpteFields.gamesOwned;
        userDB.updateOne(
            { email: req.query.email },
            { $set: udpteFields }
        )
        .then(result => {
            res.status(200).json({ message: 'Usuario actualizado' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

async function getFavouriteGames(req, res) {
    const userDB = await createConnection();
    try{
        userDB.findOne(
            { email: req.query.email },
            { projection: { _id: 0, favoritesGames: 1 }}
        )
        .then(result => {
            if(result.favoritesGames.length === 0){ 
                res.status(200).json({ favouriteGames: [] })
            }else{
                pool.query(
                    `SELECT * FROM games WHERE id IN (${result.favoritesGames.join(',')})`
                )
                .then(result => {
                    res.status(200).json({ favouriteGames: result.rows });
                })
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los juegos favoritos' });
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los juegos favoritos' });
    }
}

module.exports = { addUser, getAllUsers, getUser, updateUser, getFavouriteGames };

