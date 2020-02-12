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
    return JSON.stringify({
      caption: this.caption,
      id: this.id,
      time: this.time,
      done: this.done
    });
  }
}

class TaskList {
  constructor() {
    this.list = [];
  }
  addTask(task) {
    this.list.push(task);
  }
  findTask(taskId) {
    return this.list.find(task => {
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
    this.list.forEach((task, index) => {
      if (task.id === taskId) this.list.splice(index, 1);
    });
  }
  static load(content) {
    const tasks = content || [];
    const taskList = new TaskList();
    tasks.forEach(tsk => {
      taskList.addTask(
        new Task(tsk.caption, new Date(tsk.time), tsk.id, tsk.done)
      );
    });
    return taskList;
  }
  toJSON() {
    return JSON.stringify(this.list.map(tsk => JSON.parse(tsk.toJSON())));
  }
}

class ToDo {
  constructor(title, startDate, tasks, listId) {
    this.title = title;
    this.listId = listId || `list${getCount()}`;
    this.startDate = startDate;
    this.tasks = tasks || TaskList.load();
  }
  addTask(task) {
    this.tasks.addTask(task);
  }
  findTask(taskId) {
    return this.tasks.findTask(taskId);
  }
  editTaskCaption(taskId, caption) {
    this.tasks.editTaskCaption(taskId, caption);
  }
  editTaskStatus(taskId) {
    this.tasks.editTaskStatus(taskId);
  }
  deleteTask(taskId) {
    this.tasks.deleteTask(taskId);
  }
  editTitle(title) {
    this.title = title;
  }
  static load(content) {
    const toDoDetails = content || {};
    const taskList = TaskList.load(content.tasks);
    const toDo = new ToDo(
      toDoDetails.title,
      new Date(toDoDetails.startDate),
      taskList,
      toDoDetails.listId
    );
    return toDo;
  }
  toJSON() {
    const todo = {
      title: this.title,
      listId: this.listId,
      startDate: this.startDate,
      tasks: JSON.parse(this.tasks.toJSON())
    };
    return JSON.stringify(todo);
  }
}

class ToDoStore {
  constructor(filePath) {
    this.path = filePath;
    this.list = [];
  }

  initialize() {
    const content = fs.readFileSync(this.path, 'utf8');
    const toDos = JSON.parse(content || '[]');
    toDos.forEach(td => {
      const toDo = ToDo.load(td);
      this.addToDo(toDo);
    });
    return this;
  }

  save() {
    fs.writeFile(this.path, this.toJSON(), () => {});
  }

  addToDo(toDo) {
    this.list.push(toDo);
    this.save();
  }
  has(todoId) {
    return this.list.some(todo => {
      return todo.listId === todoId;
    });
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
    const todoList = [];
    this.list.forEach(todo => {
      todoList.push(JSON.parse(todo.toJSON()));
    });
    return JSON.stringify(todoList);
  }
}

module.exports = { TaskList, Task, ToDo, ToDoStore };
