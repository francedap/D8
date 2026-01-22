const express = require('express');
const router = express.Router();
const userClassificationController = require('../controllers/userClassificationController');

router.post('/users/:id/subscribe', userClassificationController.subscribe);
router.get('/users/:id', userClassificationController.getUserClassifications);

module.exports = router;
