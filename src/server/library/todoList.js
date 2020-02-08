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
  editDescription(description) {
    this.description = description;
  }
  editStatus() {
    this.done = !this.done;
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
  findTask(taskId) {
    return this.list.find(task => {
      return task.id === taskId;
    });
  }
  editTaskDescription(taskId, description) {
    const task = this.findTask(taskId);
    if (task) task.editDescription(description);
  }
  editTaskStatus(taskId) {
    const task = this.findTask(taskId);
    if (task) task.editStatus();
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
        new Task(tsk.description, new Date(tsk.time), tsk.id, tsk.done)
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
  editTaskDescription(taskId, description) {
    this.tasks.editTaskDescription(taskId, description);
  }
  editTaskStatus(taskId) {
    this.tasks.editTaskStatus(taskId);
  }
  deleteTask(taskId) {
    this.tasks.deleteTask(taskId);
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
  findTask(taskId) {
    const task = this.list.find(todo => {
      return todo.findTask(taskId);
    });
    return task;
  }
  editTaskDescription(taskId, description) {
    this.list.forEach(todo => todo.editTaskDescription(taskId, description));
  }
  deleteTask(taskId) {
    this.list.forEach(todo => todo.deleteTask(taskId));
  }
  editTaskStatus(taskId) {
    this.list.forEach(todo => todo.editTaskStatus(taskId));
  }
  deleteToDo(todoId) {
    this.list.forEach((todo, index) => {
      if (todo.listId === todoId) this.list.splice(index, 1);
    });
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
