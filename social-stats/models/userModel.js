class User {
  constructor(id, username, email, password, points, level, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.points = points;
    this.level = level;
    this.role = role;
  }
}

module.exports = User;
