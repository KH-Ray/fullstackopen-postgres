const router = require('express').Router();

router.delete('/', async (req, res) => {
  req.session.token = null;
  req.session.save();

  console.log(req.session);

  res.status(204).end();
});

module.exports = router;
