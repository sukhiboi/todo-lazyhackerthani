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

  describe('createSession', () => {
    it('should create a session with new session id', () => {
      const now = new Date();
      const clock = sinon.useFakeTimers(now);
      const id = clock.now;
      const user = new User('sukhi', 123);
      const newSessionId = user.createSession();
      assert.strictEqual(newSessionId, id);
      sinon.restore();
    });
  });

  describe('removeSession', () => {
    it('should remove the existing session with new session id', () => {
      const now = new Date();
      const clock = sinon.useFakeTimers(now);
      const id = clock.now;
      const user = new User('sukhi', 123);
      user.createSession();
      const result = user.removeSession();
      assert.strictEqual(result, '');
      sinon.restore();
    });
  });

  describe('verifySessionId', () => {
    it('should verify the sessionId when user is loggedIn', () => {
      const now = new Date();
      const clock = sinon.useFakeTimers(now);
      const id = clock.now;
      const user = new User('sukhi', 123);
      user.createSession();
      const result = user.verifySessionId(id);
      assert.isTrue(result);
      sinon.restore();
    });
    it('should not verify the session id when sessionId is falsy value', () => {
      const user = new User('sukhi', 123);
      const result = user.verifySessionId('');
      assert.isFalse(result);
    });
    it("should give false when session doesn't matched", () => {
      const user = new User('sukhi', 123);
      user.createSession();
      const result = user.verifySessionId('1234567890');
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
