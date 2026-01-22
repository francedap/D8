const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/', statController.getStats);
router.post('/users/:id', statController.addStat);

module.exports = router;
