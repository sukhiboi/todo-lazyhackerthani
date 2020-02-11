const fs = require('fs');

const { App } = require('./app');
const { ToDoList, ToDo, Task } = require('../library/todoList');

const MIME_TYPES = require('./mimeTypes');

const TODO_STORE = require(`${__dirname}/../../../config.js`);
const toDoList = ToDoList.load(fs.readFileSync(TODO_STORE, 'utf8') || '[]');

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

const getToDos = function(req, res, next) {
  res.end(toDoList.toJSON());
};

const notFound = function(req, res) {
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.writeHead(404);
  res.end('Not Found');
};
const methodNotAllowed = function(req, res) {
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.writeHead(400);
  res.end('Method Not Allowed');
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
  toDoList.editToDoTitle(todoId, title);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const deleteToDo = function(req, res, next) {
  if (req.url !== '/deleteToDo') {
    next();
    return;
  }
  const { todoId } = JSON.parse(req.body);
  toDoList.deleteToDo(todoId);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const createToDo = function(req, res, next) {
  if (req.url !== '/createToDo') {
    next();
    return;
  }
  const { toDoName } = JSON.parse(req.body);
  const toDo = ToDo.load({ title: toDoName, startDate: new Date() });
  toDoList.addToDo(toDo);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const deleteTask = function(req, res, next) {
  if (req.url !== '/deleteTask') {
    next();
    return;
  }
  const { taskId } = JSON.parse(req.body);
  toDoList.deleteTask(taskId);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const editTaskDescription = function(req, res, next) {
  if (req.url !== '/editTaskDescription') {
    next();
    return;
  }
  const { taskText, taskId } = JSON.parse(req.body);
  toDoList.editTaskDescription(taskId, taskText);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const editTaskStatus = function(req, res, next) {
  if (req.url !== '/editTaskStatus') {
    next();
    return;
  }
  const { taskId } = JSON.parse(req.body);
  toDoList.editTaskStatus(taskId);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const createTask = function(req, res, next) {
  if (req.url !== '/createTask') {
    next();
    return;
  }
  const { taskName, todoId } = JSON.parse(req.body);
  const task = new Task(taskName, new Date());
  toDoList.addTask(todoId, task);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.end(toDoList.toJSON());
};

const app = new App();
app.use(readBody);
app.get('', serveStaticPage);
app.get('/getToDos', getToDos);
app.post('/createTask', createTask);
app.post('/createToDo', createToDo);
app.post('/editTaskDescription', editTaskDescription);
app.post('/deleteTask', deleteTask);
app.post('/editTaskStatus', editTaskStatus);
app.post('/deleteToDo', deleteToDo);
app.post('/editToDoTitle', editToDoTitle);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
