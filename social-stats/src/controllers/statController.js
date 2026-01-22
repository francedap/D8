const statDao = require('../dao/statDao');
const actionDao = require('../dao/actionDao');
const userDao = require('../dao/userDao');
const classificationDao = require('../dao/classificationsDao');

const BASE = 50;
function getLevelFromPoints(points) {
  const raw = Math.floor(Math.sqrt(points / BASE)) + 1;
  return Math.min(Math.max(raw, 1), 999);
}

exports.getStats = (req, res) => {
  statDao.getAllStats((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ stats: rows });
  });
};

// Inserisce una nuova statistica e aggiorna punti/livello
exports.addStat = (req, res) => {
  const userId = req.params.id;
  const { classification, title, value, category } = req.body;
  const now = new Date().toISOString();

  classificationDao.getClassificationByName(classification, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: 'Classifica non trovata' });

    const classificationId = row.id;
    const actionPoints = 20;

    statDao.insertStat(userId, classificationId, title, value, category, now, err => {
      if (err) return res.status(500).json({ error: err.message });

      actionDao.insertAction(userId, classificationId, 'new_stat', actionPoints, now, err => {
        if (err) return res.status(500).json({ error: err.message });

        userDao.getUserById(userId, (err, user) => {
          if (err || !user) return res.status(404).json({ error: 'Utente non trovato' });

          const newPoints = user.points + actionPoints;
          const newLevel = getLevelFromPoints(newPoints);

          userDao.updatePointsAndLevel(userId, newPoints, newLevel, err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
              message: 'Statistica e azione salvate con successo!',
              points: newPoints,
              level: newLevel
            });
          });
        });
      });
    });
  });
};
