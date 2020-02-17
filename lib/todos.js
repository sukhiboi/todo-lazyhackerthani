const Todo = require('./todo');
const Task = require('./task');

class Todos {
  constructor() {
    this.list = [];
  }
  addTodo(todo) {
    this.list.push(todo);
    return this.list;
  }
  deleteTodo(todoId) {
    this.list.forEach((todo, index) => {
      if (todo.id === todoId) this.list.splice(index, 1);
    });
    return this.list;
  }
  findTodo(todoId) {
    return this.list.find(todo => {
      return todo.id === todoId;
    });
  }
  editTodoTitle(todoId, title) {
    const todo = this.findTodo(todoId);
    if (todo) todo.editTitle(title);
    return Boolean(todo);
  }
  addTask(todoId, task) {
    const TODO = this.findTodo(todoId);
    if (TODO) {
      TODO.addTask(task);
    }
    return Boolean(TODO);
  }
  findTask(taskId) {
    const task = this.list.reduce((context, todo) => {
      return todo.findTask(taskId);
    }, null);
    return task;
  }
  editTaskCaption(taskId, caption) {
    const task = this.findTask(taskId);
    if (task) task.editCaption(caption);
    return Boolean(task);
  }
  editTaskStatus(taskId) {
    const task = this.findTask(taskId);
    if (task) task.toggleStatus();
    return Boolean(task);
  }
  deleteTask(taskId) {
    this.list.forEach(todo => todo.deleteTask(taskId));
  }
  toJSON() {
    return [...this.list];
  }
  static initialize(store) {
    const TODOS = new Todos();
    TODOS.list = store.map(todo => {
      const { title, fromDate, tasks, id } = todo;
      const taskList = tasks.map(task => {
        const { caption, time, id, done } = task;
        return new Task(caption, time, id, done);
      });
      return new Todo(title, fromDate, taskList, id);
    });
    return TODOS;
  }
}

module.exports = Todos;
