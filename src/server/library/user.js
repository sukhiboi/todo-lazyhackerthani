class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
  verifyPassword(password) {
    return this.password === password;
  }
}

module.exports = User;
