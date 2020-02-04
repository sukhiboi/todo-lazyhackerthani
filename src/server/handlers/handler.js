const fs = require('fs');

const { App } = require('./app');
const { loadTemplate } = require('../library/viewTemplate');
const { ToDoList } = require('../library/todoList');

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

const TODO_STORE = `${__dirname}/../assets/todos.json`;
const todoListOld = JSON.parse(fs.readFileSync(TODO_STORE, 'utf8'));

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

const serveTodoPage = function(req, res, next) {
  const taskListName = `${req.url.match(/^\/page_(.*)/)[1]}`;
  if (!(`list_${taskListName}` in todoListOld)) {
    next();
    return;
  }

  ////

  let tasks = '';
  todoListOld[`list_${taskListName}`].forEach((taskProperties, index) => {
    tasks += `<input type="checkbox" name="checkBox" id="${index}" ${
      taskProperties.done ? 'checked' : ''
    } />${taskProperties.description}<br />`;
  });
  /////
  const content = loadTemplate('todoPage.html', { tasks, taskListName });
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.end(content);
};

const decodeUriText = function(encodedText) {
  return decodeURIComponent(encodedText.replace(/\+/g, ' '));
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = decodeUriText(value);
  return query;
};

const addTaskList = function(req, res, next) {
  const taskListName = pickupParams({}, req.body).fileName;
  if (req.url !== '/saveTaskList') {
    next();
    return;
  }
  todoListOld[`list_${taskListName}`] =
    todoListOld[`list_${taskListName}`] || [];
  fs.writeFileSync(TODO_STORE, JSON.stringify(todoListOld));
  res.writeHead(301, {
    Location: `page_${taskListName}`
  });
  res.end();
};

const addTask = function(req, res, next) {
  if (req.url !== '/addTask') {
    next();
    return;
  }
  const taskListName = `${req.headers.referer.match(/\/page_(.*)/)[1]}`;
  const description = pickupParams({}, req.body).task;
  todoListOld[`list_${taskListName}`].push({
    description,
    date: new Date(),
    done: false,
    id: `task${todoListOld[`list_${taskListName}`].length}`
  });
  fs.writeFileSync(TODO_STORE, JSON.stringify(todoListOld));
  res.writeHead(301, {
    Location: `page_${taskListName}`
  });
  res.end();
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

const app = new App();

app.use(readBody);

app.get('', serveStaticPage);
app.get('/page_', serveTodoPage);

app.post('/saveTaskList', addTaskList);
app.post('/addTask', addTask);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
