const router = require('express').Router();
const { Blog, User } = require('../models');
const { blogFinder, tokenExtractor } = require('../utils/middleware');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  let where = {};
  let order = [['likes', 'DESC']];

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order,
  });

  res.status(200).json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
  });

  res.status(201).json(blog);
});

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.findByPk(req.params.id);

    if (user.id !== blog.userId) {
      throw new Error('Only the user that posted this blog can delete!');
    }

    await req.blog.destroy();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(401).end();
  }
});

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.note);
});

module.exports = router;
