'use strict';
const sqlite = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../', 'social_stats.db');



const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore connessione DB:', err.message);
    throw err; // Fa crashare l'app se non trova il DB, che è giusto
  } else {
    console.log('✅ Connesso al database SQLite.');
  }
});

module.exports = db;