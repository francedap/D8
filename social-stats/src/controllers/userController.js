
'use strict';

const userDao = require('../dao/userDao');
const statsDao = require('../dao/statDao');
const actionsDao = require('../dao/actionDao');
const classificationsDao = require('../dao/classificationsDao');
const userClassificationsDao = require('../dao/userClassificationDao');

// GET /users (per la classifica)
exports.getUsers = async (req, res) => {
  try {
    const users = await userDao.getAllUsers();

    res.json({ users: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /api/users/:id/profile
exports.getUserProfile = async (req, res) => {
  try {
  
    const profileData = await userDao.getUserProfileData(req.params.id);
    
    
    res.json({ profile: profileData });

  } catch (err) {
    if (err.message === "Utente non trovato") {
      res.status(404).json({ error: err.message });
    } else {
      
      console.error("ERRORE Controller (getUserProfile):", err);
      res.status(500).json({ error: err.message });
    }
  }
};

// GET /users/:id/actions
exports.getUserActions = async (req, res) => {
  try {
    const actions = await userDao.getUserActions(req.params.id);
 
    res.json({ actions: actions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /users/:id/classifications
exports.getUserClassifications = async (req, res) => {
  try {
    const classifications = await userDao.getUserClassifications(req.params.id);
    
    res.json({ classifications: classifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aggiunge punti e aggiorna il livello

const BASE = 50;
function getLevelFromPoints(points) {
  const raw = Math.floor(Math.sqrt(points / BASE)) + 1;
  return Math.min(Math.max(raw, 1), 999);
}

exports.addPoints = async (req, res) => {
  const userId = req.params.id;
  const { points } = req.body;
  try {
    const user = await userDao.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const newPoints = (user.points || 0) + points;
    const newLevel = getLevelFromPoints(newPoints);
    await userDao.updatePointsAndLevel(userId, newPoints, newLevel);
    res.json({ message: 'Punti aggiornati', points: newPoints, level: newLevel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aggiunge statistiche dalla Dashboard
 
exports.addStats = async (req, res) => {
  const userId = req.params.id;
  const { classification, title, value } = req.body;


  const pointsForStats = parseInt(value, 10); 
  const pointsForProfile = 20; 

  if (!classification || !title || isNaN(pointsForStats)) {
    return res.status(400).json({ error: 'Dati mancanti o non validi.' });
  }

  try {

    const classData = await classificationsDao.findClassificationByName(classification);
    if (!classData) {
      return res.status(404).json({ error: 'Classifica non trovata' });
    }
    const classificationId = classData.id;

  
    await actionsDao.insertAction(userId, classificationId, title, pointsForProfile);


    const user = await userDao.getUserById(userId);
   
    const newTotalPoints = user.points + pointsForProfile; 
    const newLevel = getLevelFromPoints(newTotalPoints);

  
    await userDao.updatePointsAndLevel(userId, newTotalPoints, newLevel);
    
 
    await statsDao.updateStats(userId, classificationId, pointsForStats);

   
    res.json({
      message: 'Statistiche aggiornate con successo!',
      points: newTotalPoints, 
      level: newLevel
    });

  } catch (err) {
    console.error("ERRORE Controller (addStats):", err);
    res.status(500).json({ error: 'Errore interno del server.' });
  }
};

//POST /api/users/subscribe

exports.subscribe = async (req, res) => {
  const { user_id, classification_id } = req.body;

  try {
  
    await userClassificationsDao.subscribeUserToClassification(user_id, classification_id);
    
  
    await statsDao.createEmptyStat(user_id, classification_id);

    res.status(201).json({ message: 'Iscrizione avvenuta con successo!' });
  
  } catch (err) {
    
    if (err.message === 'Sei già iscritto a questa classifica.') {
      return res.status(409).json({ error: err.message });
    }
    console.error("ERRORE Controller (subscribe):", err);
    res.status(500).json({ error: 'Errore interno del server.' });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const changes = await userDao.updateUserRole(req.params.id, req.body.role);
    if (changes === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({ message: 'Ruolo aggiornato con successo' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const changes = await userDao.deleteUserById(req.params.id);
    if (changes === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({ message: 'Utente eliminato con successo' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};