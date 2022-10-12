const jwt = require('jsonwebtoken');
const JWT_SECRET = 'veryhiddensecretfullofsecrets'; // TODO: Explain that it must be much more complex
const Admin = require('../models/admin');

const getJwtToken = (id) => {
  return jwt.sign( { id }, JWT_SECRET);
}

const isAuthorized = (token) => {
  return jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) return false;

    return Admin.findOne({ _id: decoded.id })
      .then((admin) => {
        return Boolean(admin);
      });
  });
}

module.exports = {getJwtToken, isAuthorized};
