const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId', 'id'] },
    },
  });
  res.json(users);
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
