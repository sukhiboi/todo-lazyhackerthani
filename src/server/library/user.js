class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
    this.sessionId = new Date().getTime();
  }
  verifyPassword(password) {
    return this.password === password;
  }
  verifySessionId(sessionId) {
    return this.sessionId == sessionId;
  }
  toJSON() {
    return { name: this.name, password: this.password };
  }
}

module.exports = User;
