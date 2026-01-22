'use strict';
// Importa la connessione al DB
const db = require('../config/db.js');


exports.getTop3Users = () => {
  return new Promise((resolve, reject) => {

    console.log('--- DAO: Inizio Promise getTop3Users ---');

    
    const sql = 'SELECT username, level FROM users ORDER BY points DESC LIMIT 3';
    
    console.log('--- DAO: Eseguo la query SQL... ---');

    db.all(sql, [], (err, rows) => {

      console.log('--- DAO: Callback della query eseguito! ---');

      if (err) {

        console.error('--- DAO: Errore nella query ---', err);

        reject(err);
      } else {
        console.log('--- DAO: Query OK, risolvo la Promise. ---');
        resolve(rows);
      }
    });
  });
};