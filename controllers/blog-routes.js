const router = require('express').Router();
const { Blog, User, Comment } = require('../models');

// GET ALL BLOGS and render the homepage
router.get('/', async (req, res) => {
  try {
    const dbBlogData = await Blog.findAll({
        attributes: ['id', 'title', 'creation_date'],
    });
    res.status(200).json(dbBlogData);
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
      res.status(404).json({ message: 'There is no Blog with that ID'});
      return;
    }
    res.status(200).json(dbBlogData);
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
router.put('/blog/:id', (req, res) => {
  // update product data
  Blog.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((blog) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
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
      res.status(404).json({ message: 'There is no Blog with that ID'});
      return;
    }
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
