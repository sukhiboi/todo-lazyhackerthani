const fs = require('fs');
const request = require('supertest');
const sinon = require('sinon');
const assert = require('chai').assert;
const { router } = require('../src/server/library/handler');

describe('serveStaticPage', () => {
  it('should give the index.html page when the url is /', done => {
    request(router.serve.bind(router))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200)
      .expect(/login/, done);
  });
  it('should give the indexStyle.css', done => {
    request(router.serve.bind(router))
      .get('/css/indexStyle.css')
      .expect('Content-Type', 'text/css')
      .expect(200)
      .expect(/#loginDiv/, done);
  });
  it('should give the indexScript.js', done => {
    request(router.serve.bind(router))
      .get('/scripts/indexScript.js')
      .expect('Content-Type', 'application/javascript')
      .expect(200)
      .expect(/XMLHttpRequest/, done);
  });
});

describe('not Found file', () => {
  it('should give the not found page when the url is /index.html/invalid', done => {
    request(router.serve.bind(router))
      .get('/index.html/invalid')
      .expect('Content-Type', 'text/html')
      .expect(404, done)
      .expect(/Not Found/);
  });
  it('should give the not found page when the url is /invalid', done => {
    request(router.serve.bind(router))
      .get('/invalid')
      .expect('Content-Type', 'text/html')
      .expect(404, done)
      .expect(/Not Found/);
  });
});

describe('method not allowed', () => {
  it('should give the method not allowed when the method is not get/post', done => {
    request(router.serve.bind(router))
      .put('/invalid')
      .expect('Content-Type', 'text/html')
      .expect(400, done)
      .expect(/Method Not Allowed/, done);
  });
});

describe.skip('createTodo', function() {
  let fakeWriter;
  let now = new Date();

  beforeEach(function() {
    fakeWriter = sinon.fake();
    sinon.useFakeTimers(now.getTime());
    sinon.replace(fs, 'writeFileSync', fakeWriter);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should response back with all the todos ', function(done) {
    request(router.serve.bind(router))
      .post('/createToDo')
      .send(`{"toDoName": "Home"}`)
      .expect(200)
      .expect(/Home/, () => {
        assert.deepStrictEqual(
          fakeWriter.firstCall.args[1],
          `[{"title":"Home","listId":"list${now.getTime()}","startDate":"${now.toJSON()}","tasks":[]}]`
        );
        done();
      });
  });

  it('should response back with file not found ', function(done) {
    request(router.serve.bind(router))
      .post('/createToDoInvalid')
      .send(`{"toDoName": "Home"}`)
      .expect(404)
      .expect(/Not Found/, done);
  });
});

describe.skip('deleteTodo', function() {
  let fakeWriter;
  let now = new Date();

  beforeEach(function() {
    fakeWriter = sinon.fake();
    sinon.useFakeTimers(now.getTime());
    sinon.replace(fs, 'writeFileSync', fakeWriter);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should response back with all the todos ', function(done) {
    request(router.serve.bind(router))
      .post('/createToDo')
      .send(`{"toDoName": "Home"}`)
      .expect(200)
      .expect(/Home/, () => {
        assert.deepStrictEqual(
          fakeWriter.firstCall.args[1],
          `[{"title":"Home","listId":"list${now.getTime()}","startDate":"${now.toJSON()}","tasks":[]}]`
        );
        request(router.serve.bind(router))
          .post('/deleteToDo')
          .send(`{"todoId":"list${now.getTime()}"}`)
          .expect(200, () => {
            assert.deepStrictEqual(fakeWriter.secondCall.args[1], `[]`);
          });
      });
  });
});
