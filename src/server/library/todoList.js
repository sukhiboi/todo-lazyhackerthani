const fs = require('fs');

const getCount = () => {
  const date = new Date();
  return date.getTime();
};

class Task {
  constructor(description, time, id, done = false) {
    this.description = description;
    this.id = id || `task${getCount()}`;
    this.time = time;
    this.done = done;
  }
  toJSON() {
    return JSON.stringify({
      description: this.description,
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
  static load(content) {
    const tasks = content || [];
    const taskList = new TaskList();
    tasks.forEach(tsk => {
      taskList.addTask(new Task(tsk.description, new Date(tsk.time), tsk.id));
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
}

module.exports = { TaskList, Task, ToDo, ToDoList };
