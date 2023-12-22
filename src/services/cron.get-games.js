const path = require('path');
const cron = require('node-cron');
const { Pool } = require('pg');
const axios = require('axios');
const { scrapperRawg, scrapperRawgNewGames, scrapperTrendingGames, scraperBestGames } = require('../services/scrapper-games');
const fs = require('fs');
const jsonFilePath = path.join(__dirname, '..', 'datos', 'scrapperRawg.json');


// const url = 'http://fervent-kapitsa.212-227-110-211.plesk.page/scrapper/get-games';


const scrapperRawgJson = async () => {
  try {
    console.log('Obteniendo datos...');
    const response = await scrapperRawg();

    // fs.writeFileSync(jsonFilePath, JSON.stringify(response, null, 2), 'utf-8');
    console.log('Datos guardados en JSON:', jsonFilePath);
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
  }
};

const scrapperRawgNewGamesJson = async () => {
  try {
    console.log('Obteniendo datos...');
    const response = await scrapperRawgNewGames();

    console.log('Datos guardados en JSON:', jsonFilePath);
  } catch (error) {
    console.error('Error al obtener o guardar datos:', error.message);
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

const updateDbFromJson = async () => {
  try {
    console.log('Actualizando la base de datos desde el JSON...');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const data = JSON.parse(jsonData);

    await Promise.all(
      data.map(async (game) => {
        const details = game.details;

        const rating = parseFloat(game.rating);
        const save = parseFloat(game.save.replace(',', '.'));

        if (isNaN(rating)) {
          game.rating = 0;
        }

        if (isNaN(save)) {
          game.save = 0;
        }

        if (details.releaseDate === undefined || details.releaseDate === null) {
          details.releaseDate = new Date(0);
        }

        const query = `
          INSERT INTO games (
            title, rating, save, detailsLink, releaseDate, platforms,
            description, sugerencias, avgTime, genres, buy, ageRating, trailer, image
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

        const params = [
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

        await pool.query(query, params);
      })
    );

    console.log('Base de datos actualizada desde el JSON.');
  } catch (error) {
    console.error('Error al actualizar la base de datos desde el JSON:', error.message);
  }
};

cron.schedule('0 0 */10 * *', scraperBestGames);

cron.schedule('0 1 */5 * *', scrapperTrendingGames);

cron.schedule('0 2 */2 * *', scrapperRawgNewGamesJson);

cron.schedule('*/1 * * * *', updateDbFromJson);