const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error de traducción' });
};

module.exports = errorMiddleware;