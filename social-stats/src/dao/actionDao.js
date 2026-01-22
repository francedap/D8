// src/dao/actionsDao.js
'use strict';
const db = require('../config/db.js');

/**
 * Inserisce una new azione nella tabella 'actions'
 */
exports.insertAction = (userId, classificationId, action, points) => {
  return new Promise((resolve, reject) => {
    // Usiamo 'date' come nel tuo schema
    const sql = 'INSERT INTO actions (user_id, classification_id, action, points, date) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, classificationId, action, points, new Date().toISOString()], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};