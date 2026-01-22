'use strict';
const db = require('../config/db.js');


exports.updateStats = async (userId, classificationId, pointsToAdd) => {
  

  const selectSql = 'SELECT * FROM stats WHERE user_id = ? AND classification_id = ?';
  
  const existingStat = await new Promise((resolve, reject) => {
    db.get(selectSql, [userId, classificationId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

  if (existingStat) {
  
    const newPoints = existingStat.value + pointsToAdd; 
    const updateSql = 'UPDATE stats SET value = ? WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.run(updateSql, [newPoints, existingStat.id], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });

  } else {
  
    const insertSql = 'INSERT INTO stats (user_id, classification_id, value) VALUES (?, ?, ?)';
    
    return new Promise((resolve, reject) => {
      db.run(insertSql, [userId, classificationId, pointsToAdd], function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  }
};

exports.createEmptyStat = (userId, classificationId) => {
  return new Promise((resolve, reject) => {
    
    const sql = 'INSERT OR IGNORE INTO stats (user_id, classification_id, value) VALUES (?, ?, ?)';
    
    db.run(sql, [userId, classificationId, 0], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};