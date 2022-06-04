const BadRequestError = require('./badRequestError');
const DoubleUseEmailError = require('./doubleUseEmailError');
const NoRightsError = require('./noRightsError');
const NotFoundError = require('./notFoundError');
const UnauthorizedError = require('./unauthorizedError');

module.exports = {
  BadRequestError,
  DoubleUseEmailError,
  NoRightsError,
  NotFoundError,
  UnauthorizedError,
};
