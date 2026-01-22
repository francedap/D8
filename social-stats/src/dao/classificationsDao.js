// src/dao/classificationsDao.js
'use strict';

const db = require('../config/db.js');

/**
 * Funzione 1: Trova una classifica dal suo nome
 */
exports.findClassificationByName = (name) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM classifications WHERE name = ?';
    db.get(sql, [name], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

/**
 * Funzione 2: Prende tutte le classifiche (per la pagina Classifiche)
 */
exports.getAllClassifications = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        c.id, c.name, c.description, 
        (SELECT COUNT(DISTINCT uc.user_id) FROM user_classifications uc 
         WHERE uc.classification_id = c.id) as subscribers,
        (SELECT u.username 
         FROM stats s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.classification_id = c.id 
         ORDER BY s.value DESC 
         LIMIT 1) as topUser
      FROM classifications c
      ORDER BY subscribers DESC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("ERRORE DAO (getAllClassifications):", err);
        return reject(err);
      }
      resolve(rows);
    });
  });
};


exports.getClassificationDetailsById = (id) => {
 
  const p1 = new Promise((resolve, reject) => {
    const sql = 'SELECT name, description FROM classifications WHERE id = ?';
    db.get(sql, [id], (err, row) => err ? reject(err) : resolve(row));
  });


  const p2 = new Promise((resolve, reject) => {
    const sql = `
      SELECT u.username, s.value 
      FROM stats s
      JOIN users u ON s.user_id = u.id
      WHERE s.classification_id = ?
      ORDER BY s.value DESC
      LIMIT 10
    `;
    db.all(sql, [id], (err, rows) => err ? reject(err) : resolve(rows));
  });


  return Promise.all([p1, p2]);
};