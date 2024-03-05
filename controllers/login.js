const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const express = require('express');

const { SECRET } = require('../utils/config');
const User = require('../models/user');

router.post('/', express.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  req.session.token = token;
  req.session.save();

  console.log(req.session);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
