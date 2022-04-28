const routes = require('express').Router();
const { editUser, getCurrentUser } = require('../controllers/user');
const { validateUserInfo } = require('../middlewares/validation');

routes.get('/users/me', getCurrentUser);

routes.patch('/users/me', validateUserInfo, editUser);

module.exports = routes;
