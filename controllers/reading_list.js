const router = require('express').Router();
const { ReadingList, User } = require('../models');
const { tokenExtractor } = require('../utils/middleware');

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body;

  const reading_list = await ReadingList.create({
    userId: userId,
    blogId: blogId,
  });

  res.status(201).json(reading_list);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const readingList = await ReadingList.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (user.id !== readingList.userId) {
      throw new Error(
        'Only the user that posted this blog can update read status'
      );
    }

    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } catch (error) {
    console.error(error);
    res.status(401).end();
  }
});

module.exports = router;
