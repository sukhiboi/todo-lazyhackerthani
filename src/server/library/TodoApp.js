const Todo = require('./todo');
const Task = require('./task');

class TodoApp {
  getTodos(req, res, next) {
    res.end(req.app.locals.store.toJSON());
  }

  createTodo(req, res, next) {
    if (req.url !== '/createTodo') {
      next();
      return;
    }
    const { todoName } = req.body;
    const id = `todo${new Date().getTime()}`;
    req.app.locals.store.addTodo(new Todo(todoName, new Date(), [], id));
    res.end(req.app.locals.store.toJSON());
  }

  editTodoTitle(req, res, next) {
    if (req.url !== '/editTodoTitle') {
      next();
      return;
    }
    const { title, todoId } = req.body;
    req.app.locals.store.editTodoTitle(todoId, title);
    res.end(req.app.locals.store.toJSON());
  }

  deleteTodo(req, res, next) {
    if (req.url !== '/deleteTodo') {
      next();
      return;
    }
    const { todoId } = req.body;
    req.app.locals.store.deleteTodo(todoId);
    res.end(req.app.locals.store.toJSON());
  }

  createTask(req, res, next) {
    if (req.url !== '/createTask') {
      next();
      return;
    }
    const { taskName, todoId } = req.body;
    const id = `task${new Date().getTime()}`;
    const task = new Task(taskName, new Date(), id);
    req.app.locals.store.addTask(todoId, task);
    res.end(req.app.locals.store.toJSON());
  }

  editTaskCaption(req, res, next) {
    if (req.url !== '/editTaskCaption') {
      next();
      return;
    }
    const { caption, taskId } = req.body;
    req.app.locals.store.editTaskCaption(taskId, caption);
    res.end(req.app.locals.store.toJSON());
  }

  editTaskStatus(req, res, next) {
    if (req.url !== '/editTaskStatus') {
      next();
      return;
    }
    const { taskId } = req.body;
    req.app.locals.store.editTaskStatus(taskId);
    res.end(req.app.locals.store.toJSON());
  }

  deleteTask(req, res, next) {
    if (req.url !== '/deleteTask') {
      next();
      return;
    }
    const { taskId } = req.body;
    req.app.locals.store.deleteTask(taskId);
    res.end(req.app.locals.store.toJSON());
  }

  serve(req, res) {
    return req.app.locals.store.router.serve(req, res);
  }
}

module.exports = TodoApp;
