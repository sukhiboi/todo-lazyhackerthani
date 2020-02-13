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
    this.router.get('/getTodos', this.getTodos.bind(this));
    this.router.post('/createTodo', this.createTodo.bind(this));
    this.router.post('/editTodoTitle', this.editTodoTitle.bind(this));
    this.router.post('/deleteTodo', this.deleteTodo.bind(this));
    this.router.post('/createTask', this.createTask.bind(this));
    this.router.post(
      '/editTaskDescription',
      this.editTaskDescription.bind(this)
    );
    this.router.post('/editTaskStatus', this.editTaskStatus.bind(this));
    this.router.post('/deleteTask', this.deleteTask.bind(this));
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

  getTodos(req, res, next) {
    res.end(this.store.toJSON());
  }

  createTodo(req, res, next) {
    if (req.url !== '/createTodo') {
      next();
      return;
    }
    const { todoName } = JSON.parse(req.body);
    const id = `todo${new Date().getTime()}`;
    this.store.addTodo(new Todo(todoName, new Date(), [], id));
    res.end(this.store.toJSON());
  }

  editTodoTitle(req, res, next) {
    if (req.url !== '/editTodoTitle') {
      next();
      return;
    }
    const { title, todoId } = JSON.parse(req.body);
    this.store.editTodoTitle(todoId, title);
    res.end(this.store.toJSON());
  }

  deleteTodo(req, res, next) {
    if (req.url !== '/deleteTodo') {
      next();
      return;
    }
    const { todoId } = JSON.parse(req.body);
    this.store.deleteTodo(todoId);
    res.end(this.store.toJSON());
  }

  createTask(req, res, next) {
    if (req.url !== '/createTask') {
      next();
      return;
    }
    const { taskName, todoId } = JSON.parse(req.body);
    const id = `task${new Date().getTime()}`;
    const task = new Task(taskName, new Date(), id);
    this.store.addTask(todoId, task);
    res.end(this.store.toJSON());
  }

  editTaskDescription(req, res, next) {
    if (req.url !== '/editTaskDescription') {
      next();
      return;
    }
    const { caption, taskId } = JSON.parse(req.body);
    this.store.editTaskCaption(taskId, caption);
    res.end(this.store.toJSON());
  }

  editTaskStatus(req, res, next) {
    if (req.url !== '/editTaskStatus') {
      next();
      return;
    }
    const { taskId } = JSON.parse(req.body);
    this.store.editTaskStatus(taskId);
    res.end(this.store.toJSON());
  }

  deleteTask(req, res, next) {
    if (req.url !== '/deleteTask') {
      next();
      return;
    }
    const { taskId } = JSON.parse(req.body);
    this.store.deleteTask(taskId);
    res.end(this.store.toJSON());
  }

  serve(req, res) {
    return this.router.serve(req, res);
  }
}

module.exports = TodoApp;
