const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function scrapperRawg() {
    const url = 'https://rawg.io/games';
    const url2 = 'https://rawg.io/games?page=2';

    scrapperPagination(url, 1, 3)
        .then(async response => {
            fs.writeFileSync('src/datos/scrapperRawg.json', JSON.stringify(response, null, 2), 'utf-8');
            console.log('Datos guardados en JSON:', 'datos/scrapperRawg.json');
        })
        .catch(error => {
            console.error('Error al obtener o guardar datos:', error.message);
        });
}

function scrapperRawgNewGames(req, res) {
    const url = 'https://rawg.io/discover/last-30-days';

    scrapperPagination(url, 1, 3)
        .then(async response => {
            fs.writeFileSync('src/datos/scrapperRawg.json', JSON.stringify(response, null, 2), 'utf-8');
            console.log('Datos guardados en JSON:', 'datos/scrapperRawg.json');
        })
        .catch(error => {
            console.error('Error al obtener o guardar datos:', error.message);
        });
}

function scrapperTrendingGames(req, res) {
    const url = 'https://rawg.io/';

    scrapperPagination(url, 1, 3)
        .then(async response => {
            fs.writeFileSync('src/datos/scrapperRawg.json', JSON.stringify(response, null, 2), 'utf-8');
            console.log('Datos guardados en JSON:', 'datos/scrapperRawg.json');
        })
        .catch(error => {
            console.error('Error al obtener o guardar datos:', error.message);
        });
}

function scraperBestGames(req, res) {
    const url = 'https://rawg.io/discover/best-of-the-year';

    scrapperPagination(url, 1, 3)
        .then(async response => {
            fs.writeFileSync('src/datos/scrapperRawg.json', JSON.stringify(response, null, 2), 'utf-8');
            console.log('Datos guardados en JSON:', 'datos/scrapperRawg.json');
        })
        .catch(error => {
            console.error('Error al obtener o guardar datos:', error.message);
        });
}

function scrapperRawgNextGames() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    const currentMonthUrl = `https://rawg.io/video-game-releases/${currentYear}-${currentMonth}`;
    const nextMonthUrl = `https://rawg.io/video-game-releases/${nextYear}-${nextMonth}`;

    const currentMonthPromise = scrapperPagination(currentMonthUrl, 1, 2);
    const nextMonthPromise = scrapperPagination(nextMonthUrl, 1, 2);

    Promise.all([currentMonthPromise, nextMonthPromise])
        .then(async ([currentMonthResponse, nextMonthResponse]) => {
            const combinedResponse = [...currentMonthResponse, ...nextMonthResponse];
            fs.writeFileSync('src/datos/scrapperRawg.json', JSON.stringify(combinedResponse, null, 2), 'utf-8');
            console.log('Datos guardados en JSON:', 'datos/scrapperRawg.json');
        })
        .catch(error => {
            console.error('Error al obtener o guardar datos:', error.message);
        });
}

function scrapper(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(async response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const gamesTable = $('div.discover-games-list');
                const games = [];

                gamesTable.find('.game-card-medium').each(function () {
                    const title = $(this).find('a.game-card-medium__info__name').text().trim();
                    const rating = $(this).find('div.game-card-medium__meta').text().trim();
                    const save = $(this).find('span.game-card-button__inner').text().trim();
                    const detailsLink = $(this).find('a.game-card-medium__info__name').attr('href');

                    const game = { title, rating, save, detailsLink };
                    games.push(game);
                });

                const detailedGames = await Promise.all(games.map(async (game) => {
                    const gameUrl = `https://rawg.io${game.detailsLink}`;
                    const gameDetailsResponse = await axios.get(gameUrl);
                    const gameDetailsHtml = gameDetailsResponse.data;
                    const $gameDetails = cheerio.load(gameDetailsHtml);

                    const datePublishedElement = $gameDetails('[itemprop="datePublished"]');
                    const datetimeAttribute = datePublishedElement.attr('datetime');
                    const datePublished = new Date(datetimeAttribute);

                    const platformElements = $gameDetails('[itemprop="gamePlatform"]');
                    const platforms = [];
                    platformElements.each(function () {
                        const platform = $gameDetails(this).next('a').text().trim();
                        platforms.push(platform);
                    });

                    const descriptionElement = $gameDetails('[itemprop="description"]');
                    const description = descriptionElement.find('p').map(function () {
                        return $(this).text().trim();
                    }).get();
                    const en = description[0];
                    const es = description[1];

                    const titles = [];

                    $gameDetails('.game-card-medium__info .game-card-medium__info__name').each(function () {
                        const title = $(this).text().trim();
                        titles.push(title);
                    });

                    const mediaTime = $gameDetails('div.game__meta-playtime').text().trim();

                    const genreElement = $gameDetails('.game__meta-text');
                    const genreMetaElements = genreElement.find('meta[itemprop="genre"]');
                    const genres = genreMetaElements.map(function () {
                        return $gameDetails(this).attr('content').trim();
                    }).get();

                    const whereBuy = $gameDetails('div.game__availability-inner');
                    const buy = [];

                    whereBuy.find('.game__availability-item').each(function () {
                        const link = $(this).text().trim();
                        buy.push(link);
                    });

                    const ageRatingTitle = $gameDetails('.game__meta-title:contains("Age rating")');
                    const ageRatingText = ageRatingTitle.next('.game__meta-text');
                    const ageRating = ageRatingText.text().trim();

                    const trailer = await obtenerIDDeYouTube(game.detailsLink + 'trailer');

                    const image = $gameDetails('script:contains("image_background")').html();
                    const regex = new RegExp(`"name":"${game.title}".*?"background_image":"([^"]+)"`);

                    // Ejecutar la expresión regular en el script HTML
                    const match2 = regex.exec(image);
                    const match = /"image_background":"([^"]+)"/.exec(image);
                    const fragmentoURL = match2 ? match2[1] : null;
                    let rutaImagen = `${fragmentoURL}`;
                    rutaImagen = rutaImagen.replace(/\\u002F/g, '/');

                    game.details = {
                        releaseDate: datePublished,
                        platforms: platforms,
                        description: {
                            en: en,
                            es: es
                        },
                        sugerencias: titles,
                        avgTime: mediaTime,
                        genres: genres,
                        buy: buy,
                        ageRating: ageRating,
                        trailer: trailer,
                        image: rutaImagen
                    };

                    return game;
                }));

                resolve(detailedGames);
            })
            .catch(error => {
                console.error('Error en el scrapping:', error);
                reject(error);
            });
    });
}

async function scrapperPagination(url, currentPage = 1, maxPages = 5, gamesSoFar = []) {
    if (currentPage > maxPages) {
        return gamesSoFar;
    }
    const allGames = [];

    try {
        for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
            const response = await axios.get(`${url}?page=${currentPage}`);
            console.log(`${url}?page=${currentPage}`);
            const html = response.data;
            const $ = cheerio.load(html);
            const gamesTable = $('div.discover-games-list');
            const games = [];

            gamesTable.find('.game-card-medium').each(function () {
                const title = $(this).find('a.game-card-medium__info__name').text().trim();
                const rating = $(this).find('div.game-card-medium__meta').text().trim();
                const save = $(this).find('span.game-card-button__inner').text().trim();
                const detailsLink = $(this).find('a.game-card-medium__info__name').attr('href');

                const game = { title, rating, save, detailsLink };
                games.push(game);
            });

            const detailedGames = await Promise.all(games.map(async (game) => {
                const gameUrl = `https://rawg.io${game.detailsLink}`;
                const gameDetailsResponse = await axios.get(gameUrl);
                const gameDetailsHtml = gameDetailsResponse.data;
                const $gameDetails = cheerio.load(gameDetailsHtml);

                const datePublishedElement = $gameDetails('[itemprop="datePublished"]');
                const datetimeAttribute = datePublishedElement.attr('datetime');
                const datePublished = new Date(datetimeAttribute);

                const platformElements = $gameDetails('[itemprop="gamePlatform"]');
                const platforms = [];
                platformElements.each(function () {
                    const platform = $gameDetails(this).next('a').text().trim();
                    platforms.push(platform);
                });

                const descriptionElement = $gameDetails('[itemprop="description"]');
                const description = descriptionElement.find('p').map(function () {
                    return $(this).text().trim();
                }).get();
                const en = description[0];
                const es = description[1];

                const titles = [];

                $gameDetails('.game-card-medium__info .game-card-medium__info__name').each(function () {
                    const title = $(this).text().trim();
                    titles.push(title);
                });

                const mediaTime = $gameDetails('div.game__meta-playtime').text().trim();

                const genreElement = $gameDetails('.game__meta-text');
                const genreMetaElements = genreElement.find('meta[itemprop="genre"]');
                const genres = genreMetaElements.map(function () {
                    return $gameDetails(this).attr('content').trim();
                }).get();

                const whereBuy = $gameDetails('div.game__availability-inner');
                const buy = [];

                whereBuy.find('.game__availability-item').each(function () {
                    const link = $(this).text().trim();
                    buy.push(link);
                });

                const ageRatingTitle = $gameDetails('.game__meta-title:contains("Age rating")');
                const ageRatingText = ageRatingTitle.next('.game__meta-text');
                const ageRating = ageRatingText.text().trim();

                const trailer = await obtenerIDDeYouTube(game.detailsLink + 'trailer');

                const image = $gameDetails('script:contains("image_background")').html();
                const regex = new RegExp(`"name":"${game.title}".*?"background_image":"([^"]+)"`);

                const match2 = regex.exec(image);
                const match = /"image_background":"([^"]+)"/.exec(image);
                const fragmentoURL = match2 ? match2[1] : null;
                let rutaImagen = `${fragmentoURL}`;
                rutaImagen = rutaImagen.replace(/\\u002F/g, '/');

                game.details = {
                    releaseDate: datePublished,
                    platforms: platforms,
                    description: {
                        en: en,
                        es: es
                    },
                    sugerencias: titles,
                    avgTime: mediaTime,
                    genres: genres,
                    buy: buy,
                    ageRating: ageRating,
                    trailer: trailer,
                    image: rutaImagen
                };

                return game;
            }));

            allGames.push(...detailedGames);
        }
        return allGames;
    } catch (error) {
        console.error('Error en el scrapping:', error);
        throw error;
    }
}

async function obtenerIDDeYouTube(enlace) {
    try {
        const response = await axios.get(`https://www.youtube.com/results?search_query=${enlace}`);
        const youtube = cheerio.load(response.data);

        // Encuentra todos los enlaces de videos en los resultados de búsqueda
        const commandMetadataElement = youtube('script:contains("commandMetadata")').html();

        // Extrae el fragmento de URL del script
        const match = /"url":"(\/watch\?[^"]+)"/.exec(commandMetadataElement);
        const fragmentoURL = match ? match[1] : null;

        let rutaTrailer = `https://www.youtube.com${fragmentoURL}`;

        return rutaTrailer;
    } catch (error) {
        console.error('Error al obtener URLs de videos:', error);
    }
}

module.exports = {
    scrapperRawg,
    scrapperRawgNewGames,
    scrapperTrendingGames,
    scrapperRawgNextGames,
    scraperBestGames
};