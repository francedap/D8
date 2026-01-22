'use strict';

// Importa il DAO
const leaderboardDao = require('../dao/leaderboardDao');

// Gestore per la rotta GET /api/leaderboard/top3
 
exports.getTop3 = async (req, res) => {

  console.log('--- CONTROLLER: Ricevuta richiesta per getTop3 ---');
  
  try {
    console.log('--- CONTROLLER: Chiamo il DAO... ---');

    const top3Users = await leaderboardDao.getTop3Users();
    
    console.log('--- CONTROLLER: Dati ricevuti dal DAO, invio JSON. ---');

    res.json(top3Users);
    
  } catch (err) {

    console.error('--- CONTROLLER: ERRORE NEL BLOCCO CATCH ---', err);

    console.error('Errore Controller leaderboard:', err);
    res.status(500).json({ error: 'Errore interno del server durante il caricamento della classifica.' });
  }
};