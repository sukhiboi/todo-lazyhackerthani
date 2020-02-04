class Task {
  constructor(description, id, time, done = false) {
    this.description = description;
    this.id = id;
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
      taskList.addTask(new Task(tsk.description, tsk.id, new Date(tsk.time)));
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
  constructor(title, listId, startDate, tasks) {
    this.title = title;
    this.listId = listId;
    this.startDate = startDate;
    this.tasks = tasks;
  }
  static load(content) {
    const toDoDetails = content || {};
    const taskList = TaskList.load(content.tasks);
    const toDo = new ToDo(
      toDoDetails.title,
      toDoDetails.listId,
      toDoDetails.startDate,
      taskList
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
    return `<div id="${this.listId}"><h1>${this.title.substring(
      5
    )}</h1>${this.tasks.toHTML()}</div>`;
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
    return this.list.some(todo => todo.listId === todoId);
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
  todoInHtml(todoId) {
    const todo = this.list.find(todo => {
      return todo.listId === todoId;
    });
    return todo.toHTML();
  }
}

module.exports = { TaskList, Task, ToDo, ToDoList };
