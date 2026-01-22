class Stat {
  constructor(id, user_id, classification_id, title, value, category, date) {
    this.id = id;
    this.user_id = user_id;
    this.classification_id = classification_id;
    this.title = title;
    this.value = value;
    this.category = category;
    this.date = date;
  }
}

module.exports = Stat;
