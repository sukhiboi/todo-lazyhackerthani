class Task {
  constructor(description, id, time, done = 'false') {
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

class Todo {
  constructor() {
    this.taskList = [];
  }
  addTask(task) {
    this.taskList.push(task);
  }
  toHTML() {
    return this.taskList.map(task => task.toHTML()).join('');
  }
  static load(content) {
    const taskList = JSON.parse(content || '[]');
    const todo = new Todo();
    taskList.forEach(currTask => {
      todo.addTask(
        new Task(currTask.description, currTask.id, new Date(currTask.time))
      );
    });
    return todo;
  }
  toJSON() {
    return JSON.stringify(this.taskList);
  }
}

module.exports = { Task, Todo };
