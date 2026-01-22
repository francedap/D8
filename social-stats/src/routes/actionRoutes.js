const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

router.post('/users/:id', actionController.addAction);
router.get('/users/:id', actionController.getUserActions);

module.exports = router;
