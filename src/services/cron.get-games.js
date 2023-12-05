const path = require('path');
const cron = require('node-cron');
const { Pool } = require('pg');
const axios = require('axios');

const url = 'http://fervent-kapitsa.212-227-110-211.plesk.page/scrapper/get-trending-games';

cron.schedule('*/1 * * * *', async () => {
  console.log('Actualizando el archivo JSON...');

  try {
    const response = await axios.get(url);
    const newData = response.data;

    const pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });

    const values = newData.map(game => {
      const details = game.details;

      return [
        game.title,
        parseFloat(game.rating),
        parseFloat(game.save.replace(',', '.')),
        game.detailsLink,
        details.releaseDate,
        details.platforms.join(', '),
        details.description,
        details.sugerencias.join(', '),
        details.avgTime,
        details.genres.join(', '),
        details.buy.join(', '),
        details.ageRating,
        details.trailer,
        details.image
      ];
    });

    await Promise.all(
      values.map(async (params) => {
        const query = `
          INSERT INTO games (
            title, rating, save, detailsLink, releaseDate, platforms,
            description, sugerencias, avgTime, genres, buy, ageRating, trailer, image
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

        await pool.query(query, params);
      }
    ));

  } catch (error) {
    console.error('Error al obtener datos:', error.message);
  }
});
