const router = require('express').Router();
const { User, Blog } = require('../../models');

// CREATE new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    res.status(200).json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET ALL BLOGS BY UID (logged in)
router.get('/:id', async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.params.id, {
      attributes: ['username'],
      include: {
        model: Blog,      
        attributes: [
            'title', 'creation_date',
          ],
        },
      });
    if (!dbUserData) {
      res.status(404).json({ message: 'There is no User with that ID'});
      return;
    }
    res.status(200).json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
