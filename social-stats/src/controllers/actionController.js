const actionDao = require('../dao/actionDao');
const userDao = require('../dao/userDao');

const BASE = 50;
function getLevelFromPoints(points) {
  const raw = Math.floor(Math.sqrt(points / BASE)) + 1;
  return Math.min(Math.max(raw, 1), 999);
}

const ACTION_POINTS = {
  like: 5,
  new_stat: 20,
  comment: 10,
  share: 15
};

exports.addAction = (req, res) => {
  const userId = req.params.id;
  const { action } = req.body;

  if (!action || !ACTION_POINTS[action])
    return res.status(400).json({ error: 'Azione non valida' });

  const pointsToAdd = ACTION_POINTS[action];
  const now = new Date().toISOString();

  actionDao.insertAction(userId, null, action, pointsToAdd, now, err => {
    if (err) return res.status(500).json({ error: err.message });

    userDao.getUserById(userId, (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'Utente non trovato' });

      const newPoints = user.points + pointsToAdd;
      const newLevel = getLevelFromPoints(newPoints);

      userDao.updatePointsAndLevel(userId, newPoints, newLevel, err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          message: `Azione "${action}" registrata: +${pointsToAdd} punti`,
          totalPoints: newPoints,
          level: newLevel
        });
      });
    });
  });
};

exports.getUserActions = (req, res) => {
  const userId = req.params.id;
  actionDao.getUserActions(userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ actions: rows });
  });
};
