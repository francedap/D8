'use strict';

const db = require('../config/db.js'); 
const bcrypt = require('bcrypt');


exports.getUserByIdentifier = (identifier) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.get(sql, [identifier, identifier], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};
exports.insertUser = (username, email, hash) => {
  return new Promise((resolve, reject) => {
   
    const sql = 'INSERT INTO users (username, email, password, role, points, level) VALUES (?, ?, ?, ?, ?, ?)';
    
   
    db.run(sql, [username, email, hash, 'user', 0, 1], function (err) {
      if (err) {
       
        if (err.code === 'SQLITE_CONSTRAINT') {
          return reject(new Error('Username o Email già esistenti.'));
        }
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};



exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users ORDER BY points DESC';
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};



exports.getUserProfileData = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.username,
        u.email,
        (SELECT COUNT(*) FROM actions a WHERE a.user_id = u.id) AS totalActions,
        (SELECT MIN(date) FROM actions a WHERE a.user_id = u.id) AS firstActionDate,
        (SELECT COUNT(*) FROM user_classifications uc WHERE uc.user_id = u.id) AS totalClassifications
      FROM users u
      WHERE u.id = ?
    `;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        console.error("ERRORE DAO (getUserProfileData):", err);
        return reject(err);
      }
      if (!row) return reject(new Error("Utente non trovato"));
      resolve(row);
    });
  });
};


exports.getUserActions = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT action, points, date FROM actions WHERE user_id = ? ORDER BY date DESC LIMIT 5';
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};



exports.getUserClassifications = (userId) => {
  return new Promise((resolve, reject) => {
    
    const sql = `
      SELECT DISTINCT
        c.name as classification, 
        s.value as value,
        (
          SELECT COUNT(*) + 1 
          FROM stats s2 
          WHERE s2.classification_id = s.classification_id AND s2.value > s.value
        ) as position
      FROM user_classifications uc
      JOIN classifications c ON uc.classification_id = c.id
      JOIN stats s ON uc.user_id = s.user_id AND uc.classification_id = s.classification_id
      WHERE uc.user_id = ?
      ORDER BY s.value DESC
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error("ERRORE DAO (getUserClassifications):", err);
        return reject(err);
      }
      resolve(rows);
    });
  });
};

exports.updatePointsAndLevel = (userId, newPoints, newLevel) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET points = ?, level = ? WHERE id = ?';
    db.run(sql, [newPoints, newLevel, userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};


exports.updateUserRole = (userId, newRole) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    db.run(sql, [newRole, userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};


exports.deleteUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [userId], function (err) {
      if (err) return reject(err);
      
      resolve(this.changes);
    });
  });
};