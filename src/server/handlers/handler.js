const fs = require('fs');

const { App } = require('./app');
const { loadTemplate } = require('../library/viewTemplate');
const { ToDoList, ToDo, Task } = require('../library/todoList');

const MIME_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf'
};

const TODO_STORE = `${__dirname}/../assets/todoList.json`;
const toDoList = ToDoList.load(fs.readFileSync(TODO_STORE, 'utf8'));

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

const decodeUriText = function(encodedText) {
  return decodeURIComponent(encodedText.replace(/\+/g, ' '));
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = decodeUriText(value);
  return query;
};

const serveToDoPage = function(req, res, next) {
  const taskListName = `${req.url.match(/\/(.*)\?todoId\=(.*)/)[1]}`;
  const todoId = `${req.url.match(/\/(.*)\?todoId\=(.*)/)[2]}`;
  if (!toDoList.has(todoId)) {
    next();
    return;
  }
  const tasks = toDoList.toDoInHTML(todoId);
  const content = loadTemplate('todoPage.html', { tasks });
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.end(content);
};

const addToDo = function(req, res, next) {
  const taskListName = pickupParams({}, req.body).fileName;
  if (req.url !== '/saveTaskList') {
    next();
    return;
  }
  const toDo = ToDo.load({ title: taskListName, startDate: new Date() });
  toDoList.addToDo(toDo);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.writeHead(301, {
    Location: `${taskListName}?todoId=${toDo.listId}`
  });
  res.end();
};

const addTask = function(req, res, next) {
  if (req.url !== '/addTask') {
    next();
    return;
  }
  const taskListName = `${req.headers.referer.match(/\/(.*)?todoId=(.*)/)[1]}`;
  const todoId = `${req.headers.referer.match(/\/(.*)?todoId=(.*)/)[2]}`;

  const description = pickupParams({}, req.body).task;
  const task = new Task(description, new Date());
  toDoList.addTask(todoId, task);
  fs.writeFileSync(TODO_STORE, toDoList.toJSON());
  res.writeHead(301, {
    Location: `${req.headers.referer}`
  });
  res.end();
};

const app = new App();

app.use(readBody);

app.get('', serveStaticPage);
app.get(/.*?todoId=/, serveToDoPage);

app.post('/saveTaskList', addToDo);
app.post('/addTask', addTask);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
