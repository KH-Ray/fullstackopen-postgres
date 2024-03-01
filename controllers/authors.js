const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog } = require('../models');
const { sequelize } = require('../utils/db');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId', 'id', 'url', 'title', 'likes'],
      include: [
        [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
    },
    group: ['author'],
  });

  res.status(200).json(blogs);
});

module.exports = router;
