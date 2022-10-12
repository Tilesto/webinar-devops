const User = require('../models/user');
const { isAuthorized } = require('../utils/jwt');

const getUsers = async (req, res) => {
  if (!isAuthorized(req.headers.authorization)) return res.sendStatus(401);

  return User.find({})
    .then(users => res.sendStatus(200).send(users))
    .catch(err => res.sendStatus(400).send(err))
}

const getProfile = (req, res) => {
  if (!isAuthorized(req.headers.authorization)) return res.sendStatus(401);

  return User.findOne({ id: req.params.id })
        .then((user) => {
          if (!user) {
            return res.sendStatus(404).send({ message: 'Нет пользователя с таким id' });
          }

          return res.sendStatus(200).send(user);
        })
        .catch((err) => res.sendStatus(400).send(err));
  }

const createProfile = (req, res) => {
  return User.countDocuments({})
    .then((id) => {
      return User.create({ ...req.body, id })
        .then((user) => {
          return res.sendStatus(200).send(user);
        })
        .catch((err) => res.sendStatus(400).send(err));
    });
}

const registerUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400).send({ message: 'Email или пароль не могут быть пустыми' })

  return User.findOne({ email })
    .then((user) => {
      if (user) return res.sendStatus(403).send({ message: 'Такой пользователь уже существует' });

      createProfile(req, res);
    })
    .catch((err) => res.sendStatus(400).send({ message: 'Произошла ошибка' }));
}

module.exports = {getUsers, getProfile, createProfile, registerUser};
