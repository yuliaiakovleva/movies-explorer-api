const movieRoutes = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

const { validateMovieId, validateMovieData } = require('../middlewares/validation');

movieRoutes.get('/movies', getMovies);

movieRoutes.post('/movies', validateMovieData, createMovie);

movieRoutes.delete('/movies/:id', validateMovieId, deleteMovie);

// movieRoutes.get('/movies/:id', findMovie);

module.exports = movieRoutes;
