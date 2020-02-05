const fs = require('fs');

const getCount = () => {
  const COUNT_STORE = `${__dirname}/../assets/count.json`;
  const counter = JSON.parse(fs.readFileSync(COUNT_STORE, 'utf8')) || {};
  counter.count = (counter.count || 0) + 1;
  fs.writeFileSync(COUNT_STORE, JSON.stringify(counter));
  return counter.count;
};

class Task {
  constructor(description, time, id, done = false) {
    this.description = description;
    this.id = id || `task${getCount()}`;
    this.time = time;
    this.done = done;
  }
  toHTML() {
    return `<input type="checkbox" name="checkBox" id="${this.id}" ${
      this.done ? 'checked' : ''
    } />${this.description}<br />`;
  }
}

class TaskList {
  constructor() {
    this.list = [];
  }
  addTask(task) {
    this.list.push(task);
  }
  static load(content) {
    const tasks = content || [];
    const taskList = new TaskList();
    tasks.forEach(tsk => {
      taskList.addTask(new Task(tsk.description, new Date(tsk.time), tsk.id));
    });
    return taskList;
  }
  toHTML() {
    return this.list.map(tsk => tsk.toHTML()).join('');
  }
  toJSON() {
    return JSON.stringify(this.list);
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
  static load(content) {
    const toDoDetails = content || {};
    const taskList = TaskList.load(content.tasks);
    const toDo = new ToDo(
      toDoDetails.title,
      toDoDetails.startDate,
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
  toHTML() {
    return `<div id="${this.listId}"><h1>${
      this.title
    }</h1>${this.tasks.toHTML()}</div>`;
  }
}

class ToDoList {
  constructor() {
    this.list = [];
  }
  addToDo(toDo) {
    this.list.push(toDo);
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
  }
  static load(content) {
    const toDos = JSON.parse(content || '[]');
    const toDoList = new ToDoList();
    toDos.forEach(td => {
      const toDo = ToDo.load(td);
      toDoList.addToDo(toDo);
    });
    return toDoList;
  }
  toJSON() {
    const todoList = [];
    this.list.forEach(todo => {
      todoList.push(JSON.parse(todo.toJSON()));
    });
    return JSON.stringify(todoList);
  }
  toDoInHTML(todoId) {
    const todo = this.list.find(todo => {
      return todo.listId === todoId;
    });
    return todo.toHTML();
  }
}

module.exports = { TaskList, Task, ToDo, ToDoList };
