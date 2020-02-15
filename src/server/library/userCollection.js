const User = require('./user');

class UserCollection {
  constructor() {
    this.users = {};
  }
  addUser(user) {
    this.users[user.name] = user;
  }
  findUser(username) {
    return this.users[username];
  }
  deleteUser(username) {
    delete this.users[username];
  }
  static load(rawUserContent) {
    const usersDetail = JSON.parse(rawUserContent);
    const userCollection = new UserCollection();
    for (const username in userDetail) {
      const { name, password } = usersDetail[username];
      const user = new User(name, password);
      userCollection.addUser(user);
    }
    return userCollection;
  }
}

module.exports = UserCollection;
