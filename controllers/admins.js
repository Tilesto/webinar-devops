const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const { getJwtToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const registerAdmin = (req, res) => {
  const { email, password } = req.body;
  // TODO: Move to util
  if (!email || !password) return res.sendStatus(400).send({ message: 'Email или пароль не могут быть пустыми' });

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    return Admin.findOne({ email })
      .then((admin) => {
        if (admin) return res.sendStatus(403).send({ message: 'Такой пользователь уже существует' });

        return Admin.create({ email, password: hash })
          .then(() => {
            return res.sendStatus(200).send({ message: `Пользователь ${email} успешно создан!` });
          })
          .catch((err) => res.sendStatus(400).send(err));
      })
      .catch(() => res.sendStatus(400).send({ message: 'Произошла ошибка' }));
  });
};

const authAdmin = (req, res) => {
  const { email, password } = req.body;
  // TODO: Move to util
  if (!email || !password) return res.sendStatus(400).send({ message: 'Email или пароль не могут быть пустыми' });

  return Admin.findOne({ email })
    .then((admin) => {
      if (!admin) return res.sendStatus(403).send({ message: 'Такого пользователя не существует' });

      bcrypt.compare(password, admin.password, (error, isValidPassword) => {
        if (!isValidPassword) return res.sendStatus(401).send({ message: 'Пароль не верный' });

        const token = getJwtToken(admin.id);
        return res.sendStatus(200).send({ token });
      });
    })
    .catch(() => res.sendStatus(400).send({ message: 'Произошла ошибка' }));
};

module.exports = {registerAdmin, authAdmin};
