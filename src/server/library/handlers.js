const Todo = require('./todo');
const Task = require('./task');

const getTodos = function(req, res, next) {
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
  res.end(req.app.locals.store.toJSON());
};

const editTodoTitle = function(req, res, next) {
  if (req.url !== '/editTodoTitle') {
    next();
    return;
  }
  const { title, todoId } = req.body;
  req.app.locals.store.editTodoTitle(todoId, title);
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
};

const deleteTodo = function(req, res, next) {
  if (req.url !== '/deleteTodo') {
    next();
    return;
  }
  const { todoId } = req.body;
  req.app.locals.store.deleteTodo(todoId);
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
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
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
};

const editTaskCaption = function(req, res, next) {
  if (req.url !== '/editTaskCaption') {
    next();
    return;
  }
  const { caption, taskId } = req.body;
  req.app.locals.store.editTaskCaption(taskId, caption);
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
};

const editTaskStatus = function(req, res, next) {
  if (req.url !== '/editTaskStatus') {
    next();
    return;
  }
  const { taskId } = req.body;
  req.app.locals.store.editTaskStatus(taskId);
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
};

const deleteTask = function(req, res, next) {
  if (req.url !== '/deleteTask') {
    next();
    return;
  }
  const { taskId } = req.body;
  req.app.locals.store.deleteTask(taskId);
  res.set('Content-Type', 'application/json');
  res.end(req.app.locals.store.toJSON());
};

const STATIC_USER = { userName: 'ramu', password: 'kakka' };
const loginHandler = function(req, res, next) {
  const { userName, password } = req.body;
  if (userName == STATIC_USER.userName && password === STATIC_USER.password) {
    res.redirect('/home.html');
    return;
  }
  res.redirect('/index.html');
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
  loginHandler
};
