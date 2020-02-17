const fs = require('fs');
const Todo = require('./todo');
const Task = require('./task');
const User = require('./user');
const {
  DATA_STORE_PATH,
  USERS_PATH
} = require(`${__dirname}/../../../config.js`);

const saveDataStore = function(store) {
  fs.writeFile(DATA_STORE_PATH, store, () => {});
};

const getTodos = function(req, res, next) {
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
};

const createTodo = function(req, res, next) {
  if (req.url !== '/createTodo') {
    next();
    return;
  }
  const { todoName } = req.body;
  const id = `todo${new Date().getTime()}`;
  req.app.locals.store.addTodo(new Todo(todoName, new Date(), [], id));
  res.set('Content-Type', 'application/json');
  const storeAsJSON = req.app.locals.store.toJSON();
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const editTodoTitle = function(req, res, next) {
  if (req.url !== '/editTodoTitle') {
    next();
    return;
  }
  const { title, todoId } = req.body;
  req.app.locals.store.editTodoTitle(todoId, title);
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const deleteTodo = function(req, res, next) {
  if (req.url !== '/deleteTodo') {
    next();
    return;
  }
  const { todoId } = req.body;
  req.app.locals.store.deleteTodo(todoId);
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const createTask = function(req, res, next) {
  if (req.url !== '/createTask') {
    next();
    return;
  }
  const { taskName, todoId } = req.body;
  const id = `task${new Date().getTime()}`;
  const task = new Task(taskName, new Date(), id);
  req.app.locals.store.addTask(todoId, task);
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const editTaskCaption = function(req, res, next) {
  if (req.url !== '/editTaskCaption') {
    next();
    return;
  }
  const { caption, taskId } = req.body;
  req.app.locals.store.editTaskCaption(taskId, caption);
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const editTaskStatus = function(req, res, next) {
  if (req.url !== '/editTaskStatus') {
    next();
    return;
  }
  const { taskId } = req.body;
  req.app.locals.store.editTaskStatus(taskId);
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const deleteTask = function(req, res, next) {
  if (req.url !== '/deleteTask') {
    next();
    return;
  }
  const { taskId } = req.body;
  req.app.locals.store.deleteTask(taskId);
  const storeAsJSON = req.app.locals.store.toJSON();
  res.set('Content-Type', 'application/json');
  res.end(storeAsJSON);
  saveDataStore(storeAsJSON);
};

const signupHandler = function(req, res, next) {
  const { userName, password } = req.body;
  const allUsers = req.app.locals.allUsers;
  const user = new User(userName, password);
  allUsers.addUser(user);
  const userCollectionJSON = JSON.stringify(allUsers.toJSON());
  fs.writeFile(USERS_PATH, userCollectionJSON, () => {});
  res.json({ signedUp: true });
};

const loginHandler = function(req, res, next) {
  const { userName, password } = req.body;
  const allUsers = req.app.locals.allUsers;
  const user = allUsers.findUser(userName);
  if (user && user.verifyPassword(password)) {
    res.cookie('username', userName);
    res.cookie('sessionId', user.sessionId);
    res.json({ validUser: true, user, errMsg: '' });
    return;
  }
  res.json({ validUser: false, errMsg: 'User name or Password incorrect' });
};

const validateSession = function(req, res, next) {
  const allUsers = req.app.locals.allUsers;
  const { sessionId, username } = req.cookies;
  const user = allUsers.findUser(username);
  if (user && user.verifySessionId(sessionId)) {
    return next();
  }
  res.status(203).end(JSON.stringify({ errMsg: 'Session Expired' }));
};

module.exports = {
  getTodos,
  createTask,
  createTodo,
  deleteTask,
  deleteTodo,
  editTaskCaption,
  editTaskStatus,
  editTodoTitle,
  loginHandler,
  validateSession,
  signupHandler
};
