CREATE DATABASE gamesHub;

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
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