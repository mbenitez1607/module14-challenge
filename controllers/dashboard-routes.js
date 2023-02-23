const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

//DASHBOARD renders logged in user's posts
router.get('/', withAuth, (req, res) => {
  Blog.findAll({
    where: {
      //SESSION ID FOR USER
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'contents',
      'title',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'content', 'blog_id', 'user_id', 'createdAt'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbBlogData => {
      const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
      res.render('dashboard', { blogs, logged_in: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//RENDER EDIT PAGE (update blog)
router.get('/edit/:id', withAuth, (req, res) => {
  Blog.findOne({
  where: {
  id: req.params.id
  },
  attributes: ['id', 
              'contents', 
              'title'
          ],
  include: [
  {
      model: User,
      attributes: ['username']
  },
  {
      model: Comment,
      attributes: ['id', 'content', 'blog_id', 'user_id'],
      include: {
      model: User,
      attributes: ['username']
      }
  }
  ]
})
  .then(dbBlogData => {
  const blog = dbBlogData.get({ plain: true });
  res.render('edit-blog', { blog , logged_in: true }); 
  })
  .catch(err => {
  console.log(err);
  res.status(500).json(err);
  });
});

//RENDER NEW BLOG
router.get('/newblog', (req, res) => {
res.render('new-blog');
});

module.exports = router;