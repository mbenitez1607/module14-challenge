const { User } = require('../models');

const userdata = [
  {
    username: 'Xandromus',
    password: '12345678',  
  },
  {
    username: 'Lernantino',
    password: 'qwertyui',  
  },
];

const seedUsers = () => User.bulkCreate(userdata);

module.exports = seedUsers;
