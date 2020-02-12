const fs = require('fs');

const getCount = () => {
  const date = new Date();
  return date.getTime();
};

class Task {
  constructor(caption, time, id, done = false) {
    this.caption = caption;
    this.id = id || `task${getCount()}`;
    this.time = time;
    this.done = done;
  }
  editCaption(caption) {
    this.caption = caption;
  }
  toggleStatus() {
    this.done = !this.done;
  }
  toJSON() {
    return this;
  }
}

class ToDo {
  constructor(title, startDate, tasks, listId) {
    this.title = title;
    this.listId = listId || `list${getCount()}`;
    this.startDate = startDate;
    this.tasks = tasks;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  findTask(taskId) {
    return this.tasks.find(task => {
      return task.id === taskId;
    });
  }
  editTaskCaption(taskId, caption) {
    const task = this.findTask(taskId);
    if (task) task.editCaption(caption);
  }
  editTaskStatus(taskId) {
    const task = this.findTask(taskId);
    if (task) task.toggleStatus();
  }
  deleteTask(taskId) {
    this.tasks.forEach((task, index) => {
      if (task.id === taskId) this.tasks.splice(index, 1);
    });
  }
  editTitle(title) {
    this.title = title;
  }
  toJSON() {
    return this;
  }
}

class ToDoStore {
  constructor(filePath) {
    this.path = filePath;
    this.list = [];
  }

  initialize() {
    const content = fs.readFileSync(this.path, 'utf8');
    const store = JSON.parse(content || '[]');
    this.list = store.map(todo => {
      const { title, startDate, tasks, listId } = todo;
      const taskList = tasks.map(task => {
        const { caption, time, id, done } = task;
        return new Task(caption, time, id, done);
      });
      return new ToDo(title, startDate, taskList, listId);
    });
  }

  save() {
    fs.writeFile(this.path, this.toJSON(), () => {});
  }

  addToDo(toDo) {
    this.list.push(toDo);
    this.save();
  }
  addTask(todoId, task) {
    const toDo = this.list.find(td => {
      return td.listId === todoId;
    });
    toDo.addTask(task);
    this.save();
  }
  findTask(taskId) {
    const task = this.list.reduce((context, todo) => {
      return todo.findTask(taskId);
    }, null);
    return task;
  }
  editTaskCaption(taskId, caption) {
    this.list.forEach(todo => todo.editTaskCaption(taskId, caption));
    this.save();
  }
  deleteTask(taskId) {
    this.list.forEach(todo => todo.deleteTask(taskId));
    this.save();
  }
  editTaskStatus(taskId) {
    this.list.forEach(todo => todo.editTaskStatus(taskId));
    this.save();
  }
  deleteToDo(todoId) {
    this.list.forEach((todo, index) => {
      if (todo.listId === todoId) this.list.splice(index, 1);
    });
    this.save();
  }
  findToDo(todoId) {
    return this.list.find(todo => {
      return todo.listId === todoId;
    });
  }
  editToDoTitle(todoId, title) {
    const todo = this.findToDo(todoId);
    if (todo) todo.editTitle(title);
    this.save();
  }
  toJSON() {
    return JSON.stringify(this.list);
  }
}

module.exports = { Task, ToDo, ToDoStore };
