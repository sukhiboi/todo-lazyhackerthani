class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
    this.sessionId = '';
  }
  verifyPassword(password) {
    return this.password === password;
  }
  createSession() {
    this.sessionId = new Date().getTime();
    return this.sessionId;
  }
  removeSession() {
    this.sessionId = '';
    return this.sessionId;
  }
  verifySessionId(sessionId) {
    if (Boolean(sessionId)) {
      return this.sessionId == sessionId;
    }
    return Boolean(sessionId);
  }
  toJSON() {
    return { name: this.name, password: this.password };
  }
}

module.exports = User;
