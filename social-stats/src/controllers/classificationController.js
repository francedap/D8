// src/controllers/classificationController.js
'use strict';

const classificationsDao = require('../dao/classificationsDao');

/**
 * GET /api/classifications
 */
exports.getAll = async (req, res) => {
  try {
    
    const data = await classificationsDao.getAllClassifications(); 
    res.json({ classifications: data });
  } catch (err) {
    console.error("ERRORE Controller (getAll Classifications):", err);
    res.status(500).json({ error: 'Errore interno del server.' });
  }
};

//GET /api/classifications/:id/details
exports.getDetails = async (req, res) => {
  try {
    const [details, ranking] = await classificationsDao.getClassificationDetailsById(req.params.id);
    
    if (!details) {
      return res.status(404).json({ error: 'Classifica non trovata' });
    }

    res.json({
      name: details.name,
      description: details.description,
      ranking: ranking 
    });

  } catch (err) {
    console.error("ERRORE Controller (getDetails):", err);
    res.status(500).json({ error: 'Errore interno del server.' });
  }
};