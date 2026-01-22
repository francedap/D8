class Action {
  constructor(id, user_id, classification_id, action, points, date) {
    this.id = id;
    this.user_id = user_id;
    this.classification_id = classification_id;
    this.action = action;
    this.points = points;
    this.date = date;
  }
}

module.exports = Action;
