const Todo = require('./todo');
const Task = require('./task');

class TodoApp {
  constructor(router) {
    this.router = router;
  }

  getTodos(req, res, next) {
    res.end(this.toJSON());
  }

  createTodo(req, res, next) {
    if (req.url !== '/createTodo') {
      next();
      return;
    }
    const { todoName } = req.body;
    const id = `todo${new Date().getTime()}`;
    this.addTodo(new Todo(todoName, new Date(), [], id));
    res.end(this.toJSON());
  }

  editTodoTitle(req, res, next) {
    if (req.url !== '/editTodoTitle') {
      next();
      return;
    }
    const { title, todoId } = req.body;
    this.editTodoTitle(todoId, title);
    res.end(this.toJSON());
  }

  deleteTodo(req, res, next) {
    if (req.url !== '/deleteTodo') {
      next();
      return;
    }
    const { todoId } = req.body;
    this.deleteTodo(todoId);
    res.end(this.toJSON());
  }

  createTask(req, res, next) {
    if (req.url !== '/createTask') {
      next();
      return;
    }
    const { taskName, todoId } = req.body;
    const id = `task${new Date().getTime()}`;
    const task = new Task(taskName, new Date(), id);
    this.addTask(todoId, task);
    res.end(this.toJSON());
  }

  editTaskCaption(req, res, next) {
    if (req.url !== '/editTaskCaption') {
      next();
      return;
    }
    const { caption, taskId } = req.body;
    this.editTaskCaption(taskId, caption);
    res.end(this.toJSON());
  }

  editTaskStatus(req, res, next) {
    if (req.url !== '/editTaskStatus') {
      next();
      return;
    }
    const { taskId } = req.body;
    this.editTaskStatus(taskId);
    res.end(this.toJSON());
  }

  deleteTask(req, res, next) {
    if (req.url !== '/deleteTask') {
      next();
      return;
    }
    const { taskId } = req.body;
    this.deleteTask(taskId);
    res.end(this.toJSON());
  }

  serve(req, res) {
    return this.router.serve(req, res);
  }
}

module.exports = TodoApp;
