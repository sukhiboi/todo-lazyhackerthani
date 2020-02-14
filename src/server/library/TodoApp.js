const Todo = require('./todo');
const Task = require('./task');

class TodoApp {
  constructor(router, todoStore) {
    this.router = router;
    this.store = todoStore;
  }
  initialize() {
    this.store.initialize();
    this.router.get('/getTodos', this.getTodos.bind(this));
    this.router.post('/createTodo', this.createTodo.bind(this));
    this.router.post('/editTodoTitle', this.editTodoTitle.bind(this));
    this.router.post('/deleteTodo', this.deleteTodo.bind(this));
    this.router.post('/createTask', this.createTask.bind(this));
    this.router.post('/editTaskCaption', this.editTaskCaption.bind(this));
    this.router.post('/editTaskStatus', this.editTaskStatus.bind(this));
    this.router.post('/deleteTask', this.deleteTask.bind(this));
  }

  getTodos(req, res, next) {
    res.end(this.store.toJSON());
  }

  createTodo(req, res, next) {
    if (req.url !== '/createTodo') {
      next();
      return;
    }
    const { todoName } = req.body;
    const id = `todo${new Date().getTime()}`;
    this.store.addTodo(new Todo(todoName, new Date(), [], id));
    res.end(this.store.toJSON());
  }

  editTodoTitle(req, res, next) {
    if (req.url !== '/editTodoTitle') {
      next();
      return;
    }
    const { title, todoId } = req.body;
    this.store.editTodoTitle(todoId, title);
    res.end(this.store.toJSON());
  }

  deleteTodo(req, res, next) {
    if (req.url !== '/deleteTodo') {
      next();
      return;
    }
    const { todoId } = req.body;
    this.store.deleteTodo(todoId);
    res.end(this.store.toJSON());
  }

  createTask(req, res, next) {
    if (req.url !== '/createTask') {
      next();
      return;
    }
    const { taskName, todoId } = req.body;
    const id = `task${new Date().getTime()}`;
    const task = new Task(taskName, new Date(), id);
    this.store.addTask(todoId, task);
    res.end(this.store.toJSON());
  }

  editTaskCaption(req, res, next) {
    if (req.url !== '/editTaskCaption') {
      next();
      return;
    }
    const { caption, taskId } = req.body;
    this.store.editTaskCaption(taskId, caption);
    res.end(this.store.toJSON());
  }

  editTaskStatus(req, res, next) {
    if (req.url !== '/editTaskStatus') {
      next();
      return;
    }
    const { taskId } = req.body;
    this.store.editTaskStatus(taskId);
    res.end(this.store.toJSON());
  }

  deleteTask(req, res, next) {
    if (req.url !== '/deleteTask') {
      next();
      return;
    }
    const { taskId } = req.body;
    this.store.deleteTask(taskId);
    res.end(this.store.toJSON());
  }

  serve(req, res) {
    return this.router.serve(req, res);
  }
}

module.exports = TodoApp;
