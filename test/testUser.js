const assert = require('chai').assert;
const User = require('./../src/server/library/user');

describe('User', () => {
  describe('verify password', () => {
    it('should say true for valid password', () => {
      const user = new User('ram', 123);
      assert.isTrue(user.verifyPassword(123));
    });
  });
});
