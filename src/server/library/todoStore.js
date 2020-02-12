const fs = require('fs');
const Todo = require('./todo');
const Task = require('./task');

class TodoStore {
  constructor(filePath) {
    this.path = filePath;
    this.tasks = [];
  }

  initialize() {
    const content = fs.readFileSync(this.path, 'utf8');
    const store = JSON.parse(content || '[]');
    this.tasks = store.map(todo => {
      const { title, fromDate, tasks, id } = todo;
      const taskList = tasks.map(task => {
        const { caption, time, id, done } = task;
        return new Task(caption, time, id, done);
      });
      return new Todo(title, fromDate, taskList, id);
    });
  }

  save() {
    fs.writeFile(this.path, this.toJSON(), () => {});
  }

  addTodo(todo) {
    this.tasks.push(todo);
    this.save();
  }
  addTask(todoId, task) {
    const TODO = this.tasks.find(todo => {
      return todo.id === todoId;
    });
    TODO.addTask(task);
    this.save();
  }
  findTask(taskId) {
    const task = this.tasks.reduce((context, todo) => {
      return todo.findTask(taskId);
    }, null);
    return task;
  }
  editTaskCaption(taskId, caption) {
    this.tasks.forEach(todo => todo.editTaskCaption(taskId, caption));
    this.save();
  }
  deleteTask(taskId) {
    this.tasks.forEach(todo => todo.deleteTask(taskId));
    this.save();
  }
  editTaskStatus(taskId) {
    this.tasks.forEach(todo => todo.editTaskStatus(taskId));
    this.save();
  }
  deleteTodo(todoId) {
    this.tasks.forEach((todo, index) => {
      if (todo.id === todoId) this.tasks.splice(index, 1);
    });
    this.save();
  }
  findTodo(todoId) {
    return this.tasks.find(todo => {
      return todo.id === todoId;
    });
  }
  editTodoTitle(todoId, title) {
    const todo = this.findTodo(todoId);
    if (todo) todo.editTitle(title);
    this.save();
  }
  toJSON() {
    return JSON.stringify(this.tasks);
  }
}

module.exports = TodoStore;
