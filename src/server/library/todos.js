const Todo = require('./todo');
const Task = require('./task');

class Todos {
  constructor() {
    this.todos = [];
  }
  addTodo(todo) {
    this.todos.push(todo);
    return this.todos;
  }
  deleteTodo(todoId) {
    this.todos.forEach((todo, index) => {
      if (todo.id === todoId) this.todos.splice(index, 1);
    });
    return this.todos;
  }
  findTodo(todoId) {
    return this.todos.find(todo => {
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
    const task = this.todos.reduce((context, todo) => {
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
    this.todos.forEach(todo => todo.deleteTask(taskId));
  }
  toJSON() {
    return JSON.stringify(this.todos);
  }
  initialize(rawContent) {
    const store = JSON.parse(rawContent || '[]');
    this.todos = store.map(todo => {
      const { title, fromDate, tasks, id } = todo;
      const taskList = tasks.map(task => {
        const { caption, time, id, done } = task;
        return new Task(caption, time, id, done);
      });
      return new Todo(title, fromDate, taskList, id);
    });
  }
}

module.exports = Todos;
