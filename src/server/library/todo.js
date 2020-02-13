class Todo {
  constructor(title, fromDate, tasks, id) {
    this.title = title;
    this.id = id;
    this.fromDate = fromDate;
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

module.exports = Todo;
