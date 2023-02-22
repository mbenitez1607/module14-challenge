const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./blog-routes.js');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
