const { Comment } = require('../models');

const commentdata = [
  {
    content:
      'I couldn\'t agree more, ORM makes SQL handling way easier!',
    comment_date: '6/11/2020',
    user_id: 1,
    blog_id: 3,
  },
];

const seedComments = () => Comment.bulkCreate(commentdata);

module.exports = seedComments;
