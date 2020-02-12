const fs = require('fs');

const { Router } = require('./router');
const { ToDoStore, ToDo, Task } = require('../library/todoList');

const MIME_TYPES = require('./mimeTypes');

const TODO_STORE = require(`${__dirname}/../../../config.js`);

const toDoStore = new ToDoStore(TODO_STORE);
toDoStore.initialize();

const serveStaticPage = function(req, res, next) {
  const publicFolder = `${__dirname}/../../public`;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absolutePath = publicFolder + path;
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  if (!stat || !stat.isFile()) {
    next();
    return;
  }
  const content = fs.readFileSync(absolutePath);
  const extension = path.split('.').pop();
  res.setHeader('Content-Type', MIME_TYPES[extension]);
  res.end(content);
};

const methodNotAllowed = function(req, res) {
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.writeHead(400);
  res.end('Method Not Allowed');
};

const notFound = function(req, res) {
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.writeHead(404);
  res.end('Not Found');
};

const getToDos = function(req, res, next) {
  res.end(toDoStore.toJSON());
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => (data += chunk));
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const editToDoTitle = function(req, res, next) {
  if (req.url !== '/editToDoTitle') {
    next();
    return;
  }
  const { title, todoId } = JSON.parse(req.body);
  toDoStore.editToDoTitle(todoId, title);
  res.end(toDoStore.toJSON());
};

const deleteToDo = function(req, res, next) {
  if (req.url !== '/deleteToDo') {
    next();
    return;
  }
  const { todoId } = JSON.parse(req.body);
  toDoStore.deleteToDo(todoId);
  res.end(toDoStore.toJSON());
};

const createToDo = function(req, res, next) {
  if (req.url !== '/createToDo') {
    next();
    return;
  }
  const { toDoName } = JSON.parse(req.body);
  const toDo = ToDo.load({ title: toDoName, startDate: new Date() });
  toDoStore.addToDo(toDo);
  res.end(toDoStore.toJSON());
};

const deleteTask = function(req, res, next) {
  if (req.url !== '/deleteTask') {
    next();
    return;
  }
  const { taskId } = JSON.parse(req.body);
  toDoStore.deleteTask(taskId);
  res.end(toDoStore.toJSON());
};

const editTaskDescription = function(req, res, next) {
  if (req.url !== '/editTaskDescription') {
    next();
    return;
  }
  const { taskText, taskId } = JSON.parse(req.body);
  toDoStore.editTaskDescription(taskId, taskText);
  res.end(toDoStore.toJSON());
};

const editTaskStatus = function(req, res, next) {
  if (req.url !== '/editTaskStatus') {
    next();
    return;
  }
  const { taskId } = JSON.parse(req.body);
  toDoStore.editTaskStatus(taskId);
  res.end(toDoStore.toJSON());
};

const createTask = function(req, res, next) {
  if (req.url !== '/createTask') {
    next();
    return;
  }
  const { taskName, todoId } = JSON.parse(req.body);
  const task = new Task(taskName, new Date());
  toDoStore.addTask(todoId, task);
  res.end(toDoStore.toJSON());
};

const router = new Router();
router.use(readBody);
router.get('', serveStaticPage);
router.get('/getToDos', getToDos);
router.post('/createTask', createTask);
router.post('/createToDo', createToDo);
router.post('/editTaskDescription', editTaskDescription);
router.post('/deleteTask', deleteTask);
router.post('/editTaskStatus', editTaskStatus);
router.post('/deleteToDo', deleteToDo);
router.post('/editToDoTitle', editToDoTitle);
router.get('', notFound);
router.post('', notFound);
router.use(methodNotAllowed);

module.exports = { router };
