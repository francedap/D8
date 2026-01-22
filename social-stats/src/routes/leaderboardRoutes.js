'use-strict';
const express = require('express');
const router = express.Router();

// Importa il controller
const leaderboardController = require('../controllers/leaderboardController.js');

router.get('/top3', leaderboardController.getTop3);

// Esporta il router per usarlo in app.js
module.exports = router;