const Movie = require('../models/movie');
const {
  NotFoundError,
  BadRequestError,
  NoRightsError,
} = require('../errors/errors');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  // console.log(req.params);
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail,
// movieId
module.exports.createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    director,
    country,
    year,
    duration,
    description,
    trailerLink,
    image,
    thumbnail,
  } = req.body;

  // console.log(req.body);
  // console.log(req.user._id, 'ID пользователя');
  const owner = req.user._id;

  const movieId = req.body.id;
  // console.log(req.body.id);

  Movie.create({
    nameRU,
    nameEN,
    director,
    country,
    year,
    duration,
    description,
    trailerLink,
    image,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  console.log(req.params.id, 'req.params.id');
  console.log(req.params);
  const { id } = req.params;
  console.log(id, 'movieId');
  Movie.findById(id)
    // .populate('likes')
    .orFail(() => {
      throw new NotFoundError('Фильм по указанному _id не найден.');
    })
    .then((movie) => {
      console.log(movie);
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movie._id.toString())
          .then((answer) => res.send(answer));
      } else {
        next(new NoRightsError('У вас нет права удалять этот фильм.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный _id фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.findMovie = (req, res) => {
  console.dir(req.params);
  // const { id } = req.params;
  Movie.findById(req.params.id)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res

          .status(400)

          .send({

            message: 'Переданы некорректные данные при создании карточки.',

          });
      }

      return res

        .status(500)

        .send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
};