const fs = require('fs');
const Todo = require('./todo');
const Task = require('./task');
const Router = require('./router');
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
    this.router.get('/getTodos', this.getTodos.bind(null, this.store));
    this.router.post('/createTodo', this.createTodo.bind(null, this.store));
    this.router.post(
      '/editTodoTitle',
      this.editTodoTitle.bind(null, this.store)
    );
    this.router.post('/deleteTodo', this.deleteTodo.bind(null, this.store));
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

  getTodos(store, req, res, next) {
    res.end(store.toJSON());
  }

  createTodo(store, req, res, next) {
    if (req.url !== '/createTodo') {
      next();
      return;
    }
    const { todoName } = JSON.parse(req.body);
    const id = `todo${new Date().getTime()}`;
    store.addTodo(new Todo(todoName, new Date(), [], id));
    res.end(store.toJSON());
  }

  editTodoTitle(store, req, res, next) {
    if (req.url !== '/editTodoTitle') {
      next();
      return;
    }
    const { title, todoId } = JSON.parse(req.body);
    store.editTodoTitle(todoId, title);
    res.end(store.toJSON());
  }

  deleteTodo(store, req, res, next) {
    if (req.url !== '/deleteTodo') {
      next();
      return;
    }
    const { todoId } = JSON.parse(req.body);
    store.deleteTodo(todoId);
    res.end(store.toJSON());
  }

  createTask(store, req, res, next) {
    if (req.url !== '/createTask') {
      next();
      return;
    }
    const { taskName, todoId } = JSON.parse(req.body);
    const id = `task${new Date().getTime()}`;
    const task = new Task(taskName, new Date(), id);
    store.addTask(todoId, task);
    res.end(store.toJSON());
  }

  editTaskDescription(store, req, res, next) {
    if (req.url !== '/editTaskDescription') {
      next();
      return;
    }
    const { caption, taskId } = JSON.parse(req.body);
    store.editTaskCaption(taskId, caption);
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

module.exports = TodoApp;
