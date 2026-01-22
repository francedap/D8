'use strict';
const db = require('../config/db.js');

// Cancella una sottoscrizione specifica
exports.unsubscribeFromClassification = (userId, classificationId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM user_classifications WHERE user_id = ? AND classification_id = ?';
    db.run(sql, [userId, classificationId], function(err) {
      if (err) return reject(err);
      resolve(this.changes); // Numero di righe eliminate
    });
  });
};

// Cancella tutte le sottoscrizioni di un utente
exports.unsubscribeAllClassifications = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM user_classifications WHERE user_id = ?';
    db.run(sql, [userId], function(err) {
      if (err) return reject(err);
      resolve(this.changes); // Numero di righe eliminate
    });
  });
};

exports.subscribeUserToClassification = async (userId, classificationId) => {
  
  
  const selectSql = 'SELECT * FROM user_classifications WHERE user_id = ? AND classification_id = ?';
  
  const existingSubscription = await new Promise((resolve, reject) => {
    db.get(selectSql, [userId, classificationId], (err, row) => {
      if (err) return reject(err);
      resolve(row); 
    });
  });

  if (existingSubscription) {
    throw new Error('Sei già iscritto a questa classifica.');
  }

  const insertSql = 'INSERT INTO user_classifications (user_id, classification_id) VALUES (?, ?)';
  
  return new Promise((resolve, reject) => {
    db.run(insertSql, [userId, classificationId], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};