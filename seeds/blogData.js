const { Blog } = require('../models');

const blogdata = [
  {
    title: 'Why MVC is so important',
    user_id: 1,
    creation_date: '5/8/2020',
    contents:
      'MVC allows developers to maintain a true separation of concerns, devising their code between the Model layer for data, the View layer for design, and the Controller layer for application logic.',
  },
  {
    title: 'Authentication vs. Authorization',
    user_id: 1,
    creation_date: '5/8/2020',
    contents:
      'There is a difference between authentication and authorization. Authentication means confirming your own identity, whereas authorization means being allowed access to the system.',
  },
  {
    title: 'Object-Relational Mapping',
    user_id: 2,
    creation_date: '5/8/2020',
    contents:
      'I have really loved learning about ORMs. It\'s really simplified the way I create queries in SQL!',
  },
];

const seedBlogs = () => Blog.bulkCreate(blogdata);

module.exports = seedBlogs;
