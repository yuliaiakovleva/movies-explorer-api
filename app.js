const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors/errors');
const { validateSignup, validateLogin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов
app.use(cors());
// app.use((req, res, next) => {
//   console.log(req.method, req.path, req.params);
//   next();
// });

app.post('/api/signup', validateSignup, createUser);
app.post('/api/signin', validateLogin, login);

app.use(auth);

app.use('/api', require('./routes/user'));

app.use('/api', require('./routes/movie'));

app.use(() => {
  throw new NotFoundError('Путь не найден');
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // это обработчик ошибок celebrate

app.use(errorHandler);

async function main() {
  await mongoose.connect('mongodb://0.0.0.0:27017/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);
}

main();
