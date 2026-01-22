'use strict';
const express = require('express');
const router = express.Router();


const classificationController = require('../controllers/classificationController');

// gestisce GET /api/classifications
router.get('/', (req, res) => {
    
    classificationController.getAll(req, res); 
});


// Gestisce GET /api/classifications
router.get('/', classificationController.getAll);

// Gestisce GET /api/classifications/:id/details
router.get('/:id/details', classificationController.getDetails);


module.exports = router;