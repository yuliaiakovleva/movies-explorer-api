require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  NotFoundError,
  BadRequestError,
  DoubleUseEmailError,
  UnauthorizedError,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  console.log(req.body);

  User
    .findOne({ email })
    .then((user) => {
      if (user) {
        next(new DoubleUseEmailError('Пользователь с такой почтой уже существует.'));
      }
      // ТУТ ПОПРАВИЛА ПО СРАВНЕНИЮ С ПРОШЛОЙ РАБОТОЙ
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      // const name = answer.name;
      // const email = answer.email;
      res.status(200).send({ name, email, password });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Передан неверный логин или пароль.'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError('Нет пользователя с таким id'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      next(new NotFoundError('Пользователь по такому id не найден.'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.code === 11000) {
        next(new DoubleUseEmailError('Почта принадлежит другому пользователю'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id пользователя.'));
      } else {
        next(err);
      }
    });
};

