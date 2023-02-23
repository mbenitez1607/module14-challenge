const router = require('express').Router();

const apiRoutes = require('./api');
const blogRoutes = require('./blog-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

router.use('/', blogRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
