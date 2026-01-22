const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/auth', require('./authRoutes'));
router.use('/stats', require('./statRoutes'));
router.use('/actions', require('./actionRoutes'));
router.use('/classifications', require('./classificationRoutes'));
router.use('/user_classifications', require('./userClassificationRoutes'));

module.exports = router;
