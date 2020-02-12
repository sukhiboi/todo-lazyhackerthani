const fs = require('fs');
const { ToDo, TaskList, Task } = require('./todoList');
const { Router } = require('./router');
const MIME_TYPES = require('./mimeTypes');

class TodoApp {
  constructor(todoStore) {
    this.router = new Router();
    this.store = todoStore;
  }
  initialize() {
    this.store.initialize();
    this.router.use(this.readBody);
    this.router.get('', this.serveStaticPage);
    this.router.get('/getToDos', this.getToDos.bind(null, this.store));
    this.router.post('/createToDo', this.createToDo.bind(null, this.store));
    this.router.post(
      '/editToDoTitle',
      this.editToDoTitle.bind(null, this.store)
    );
    this.router.post('/deleteToDo', this.deleteToDo.bind(null, this.store));
    this.router.post('/createTask', this.createTask.bind(null, this.store));
    this.router.post(
      '/editTaskDescription',
      this.editTaskDescription.bind(null, this.store)
    );
    this.router.post(
      '/editTaskStatus',
      this.editTaskStatus.bind(null, this.store)
    );
    this.router.post('/deleteTask', this.deleteTask.bind(null, this.store));
    this.router.get('', this.notFound);
    this.router.post('', this.notFound);
    this.router.use(this.methodNotAllowed);
  }

  readBody(req, res, next) {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      req.body = data;
      next();
    });
  }

  serveStaticPage(req, res, next) {
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
  }

  methodNotAllowed(req, res) {
    res.setHeader('Content-Type', MIME_TYPES.html);
    res.writeHead(400);
    res.end('Method Not Allowed');
  }

  notFound(req, res) {
    res.setHeader('Content-Type', MIME_TYPES.html);
    res.writeHead(404);
    res.end('Not Found');
  }

  getToDos(store, req, res, next) {
    res.end(store.toJSON());
  }

  createToDo(store, req, res, next) {
    if (req.url !== '/createToDo') {
      next();
      return;
    }
    const { toDoName } = JSON.parse(req.body);
    const toDo = ToDo.load({ title: toDoName, startDate: new Date() });
    store.addToDo(toDo);
    res.end(store.toJSON());
  }

  editToDoTitle(store, req, res, next) {
    if (req.url !== '/editToDoTitle') {
      next();
      return;
    }
    const { title, todoId } = JSON.parse(req.body);
    store.editToDoTitle(todoId, title);
    res.end(store.toJSON());
  }

  deleteToDo(store, req, res, next) {
    if (req.url !== '/deleteToDo') {
      next();
      return;
    }
    const { todoId } = JSON.parse(req.body);
    store.deleteToDo(todoId);
    res.end(store.toJSON());
  }

  createTask(store, req, res, next) {
    if (req.url !== '/createTask') {
      next();
      return;
    }
    const { taskName, todoId } = JSON.parse(req.body);
    const task = new Task(taskName, new Date());
    store.addTask(todoId, task);
    res.end(store.toJSON());
  }

  editTaskDescription(store, req, res, next) {
    if (req.url !== '/editTaskDescription') {
      next();
      return;
    }
    const { taskText, taskId } = JSON.parse(req.body);
    store.editTaskCaption(taskId, taskText);
    res.end(store.toJSON());
  }

  editTaskStatus(store, req, res, next) {
    if (req.url !== '/editTaskStatus') {
      next();
      return;
    }
    const { taskId } = JSON.parse(req.body);
    store.editTaskStatus(taskId);
    res.end(store.toJSON());
  }

  deleteTask(store, req, res, next) {
    if (req.url !== '/deleteTask') {
      next();
      return;
    }
    const { taskId } = JSON.parse(req.body);
    store.deleteTask(taskId);
    res.end(store.toJSON());
  }

  serve(req, res) {
    return this.router.serve(req, res);
  }
}

module.exports = {
  TodoApp
};
