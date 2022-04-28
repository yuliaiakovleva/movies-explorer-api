const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (str) => validator.isURL(str),
      message: 'Введите ссылку',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (str) => validator.isURL(str),
      message: 'Введите ссылку',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (str) => validator.isURL(str),
      message: 'Введите ссылку',
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    type: String,
    required: true,
    // validate: {
    //   validator: (str) => validator.isAlpha(str, 'ru-RU'),
    //   message: 'Название должно бьть на русском',
    // },
  },
  nameEN: {
    type: String,
    required: true,
    // validate: {
    //   validator: (str) => validator.isAlpha(str),
    //   message: 'Название должно бьть на английском',
    // },
  },
});

module.exports = mongoose.model('movie', userSchema);
