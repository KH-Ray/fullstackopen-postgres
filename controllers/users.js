const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User, Blog, ReadingList } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: { attributes: [] },
    },
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  let read = {
    [Op.in]: [true, false],
  };

  if (req.query.read) {
    read = req.query.read === 'true';
  }

  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
        where: {
          read,
        },
      },
    },
  });

  res.json(user);
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  res.status(201).json(user);
});

router.put('/:username', async (req, res) => {
  req.user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  req.user.username = req.body.username;
  await req.user.save();

  res.status(204).end();
});

module.exports = router;
