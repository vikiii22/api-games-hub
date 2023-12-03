const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


app.get('/', async (req, res) => {
    res.send('Hello World!');
});