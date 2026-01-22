'use strict';

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Non autorizzato' });
};


exports.isAdmin = (req, res, next) => {
  
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Accesso negato. Riservato agli admin.' });
};