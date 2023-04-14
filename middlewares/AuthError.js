const { AUTH_ERROR } = require('../utils/utils');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR;
  }
}

module.exports = { AuthError };
