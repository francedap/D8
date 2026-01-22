'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');


router.post('/login', passport.authenticate('local'), (req, res) => {
  
  if (req.user.role === 'admin') {
    res.json({ success: true, redirect: '/admin.html', user: req.user });
  } else {
    res.json({ success: true, redirect: '/profile.html', user: req.user });
  }
});

// Aggiunta della rotta per controllare la sessione
router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout fallito' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Pulisce il cookie
      res.json({ message: 'Logout avvenuto con successo' });
    });
  });
});


router.post('/signup', authController.signup);

module.exports = router;