class Task {
  constructor(caption, fromDate, id, done=false) {
    this.caption = caption;
    this.id = id || `task${new Date().getTime()}`;
    this.fromDate = fromDate;
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

module.exports = Task;
