const assert = require('chai').assert;
const sinon = require('sinon');
const User = require('./../src/server/library/user');

describe('User', () => {
  describe('verify password', () => {
    it('should say true for valid password', () => {
      const user = new User('ram', 123);
      assert.isTrue(user.verifyPassword(123));
    });
  });

  describe('verifySessionId', () => {
    it('should verify the session id', () => {
      const now = new Date();
      const clock = sinon.useFakeTimers(now);
      const id = clock.now;
      const user = new User('sukhi', 123);
      const result = user.verifySessionId(id);
      assert.isTrue(result);
      sinon.restore();
    });
    it("should give false when session doesn't matched", () => {
      const user = new User('sukhi', 123);
      const result = user.verifySessionId(123);
      assert.isFalse(result);
    });
  });

  describe('toJSON  ', () => {
    it('should return the JSON representation', () => {
      const user = new User('sukhi', 123);
      assert.deepStrictEqual(user.toJSON(), {
        name: 'sukhi',
        password: 123
      });
    });
  });
});
