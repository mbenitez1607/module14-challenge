const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET ALL BLOGS and render the homepage
router.get('/', async (req, res) => {
  try {
    const dbBlogData = await Blog.findAll({
      attributes: ['id', 'title', 'creation_date'],
    });
    // Serialize data so the template can read it
    const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET ONE BLOG BY ID
router.get('/blog/:id', async (req, res) => {
  try {
    const dbBlogData = await Blog.findByPk(req.params.id, {
      attributes: ['id', 'title', 'user_id', 'creation_date', 'contents'],
      include: [
        {
          model: User,
          attributes: [
            'username'
          ],
        },
        {
          model: Comment,
          attributes: [
            'content'
          ],
        }
      ]
    });
    if (!dbBlogData) {
      res.status(404).json({ message: 'There is no Blog with that ID' });
      return;
    }
    //res.status(200).json(dbBlogData);
    // Serialize data so the template can read it
    const blog = dbBlogData.get({ plain: true });
    console.log(`blog: ${JSON.stringify(blog)}`)

    // Pass serialized data and session flag into template
    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE NEW BLOG
router.post('/blog', async (req, res) => {
  try {
    const dbBlogData = await Blog.create({
      title: req.body.title,
      user_id: req.body.id, // TODO 
      creation_date: new Date(),
      contents: req.body.contents,
    });
    res.status(200).json(dbBlogData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE BLOG BY ID
router.put('/blog/:id', withAuth, (req, res) => {
  // update blog contents
  Blog.update({
    title: req.body.title,
    contents: req.body.contents
  },
    {
      where: {
        id: req.params.id
      }
    }).then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE BLOG BY ID
router.delete('/blog/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const blogData = await Blog.destroy({
      where: { id: req.params.id }
    });
    // If the Product ID is not present in the DB
    if (!blogData) {
      res.status(404).json({ message: 'There is no Blog with that ID' });
      return;
    }
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// RENDER LOGIN PAGE
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

//RENDER SIGNUP
router.get('/signup', (req, res) => {
  res.render('signup');
});

// RENDER PROFILE uses 'withAuth' middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
