CREATE DATABASE gamesHub;

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    rating INT NOT NULL,
    save FLOAT NOT NULL,
    detailsLink VARCHAR(255) NOT NULL,
    releaseDate DATE NOT NULL,
    platforms VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sugerencias TEXT NOT NULL,
    avgTime VARCHAR(50) NOT NULL,
    genres VARCHAR(255) NOT NULL,
    buy TEXT NOT NULL,
    ageRating VARCHAR(20) NOT NULL,
    trailer VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    realName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(255) NOT NULL,
    uuid VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    myGames TEXT NOT NULL DEFAULT '{}',
    myWishlist TEXT NOT NULL DEFAULT '{}',
    friends TEXT NOT NULL DEFAULT '{}'
);