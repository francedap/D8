const userClassificationDao = require('../dao/userClassificationDao');

// Cancella una sottoscrizione specifica
exports.unsubscribe = async (req, res) => {
  try {
    const userId = req.params.id;
    const { classification_id } = req.body;
    
    const changes = await userClassificationDao.unsubscribeFromClassification(userId, classification_id);
    
    if (changes === 0) {
      return res.status(404).json({ message: 'Sottoscrizione non trovata.' });
    }
    
    res.json({ message: 'Sottoscrizione cancellata con successo.' });
  } catch (err) {
    console.error('Errore durante la cancellazione della sottoscrizione:', err);
    res.status(500).json({ error: 'Errore durante la cancellazione della sottoscrizione.' });
  }
};

// Cancella tutte le sottoscrizioni di un utente
exports.unsubscribeAll = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const changes = await userClassificationDao.unsubscribeAllClassifications(userId);
    
    res.json({ 
      message: 'Sottoscrizioni cancellate con successo.',
      deletedCount: changes 
    });
  } catch (err) {
    console.error('Errore durante la cancellazione delle sottoscrizioni:', err);
    res.status(500).json({ error: 'Errore durante la cancellazione delle sottoscrizioni.' });
  }
};

exports.subscribe = (req, res) => {
  const userId = req.params.id;
  const { classification_id } = req.body;

  userClassificationDao.isUserSubscribed(userId, classification_id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ message: 'Sei già iscritto a questa classifica.' });

    userClassificationDao.subscribeUser(userId, classification_id, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Iscrizione completata con successo!' });
    });
  });
};

exports.getUserClassifications = (req, res) => {
  const userId = req.params.id;
  userClassificationDao.getUserClassifications(userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ classifications: rows });
  });
};
