const hide = id => (document.getElementById(id).style.display = 'none');

const show = id => (document.getElementById(id).style.display = 'block');

const handleNewTask = function() {
  const task = JSON.parse(this.responseText);
  const todoId = document.querySelector('.listIdDiv').id; //rename to taskListId
  const taskInHtml = createTaskTemplate(task);
  document.getElementById(todoId).innerHTML += taskInHtml;
};

const createTask = function(textBoxId) {
  const taskName = document.getElementById(textBoxId).value;
  const todoId = document.querySelector('.listIdDiv').id;
  if (taskName) {
    sendXHR(
      JSON.stringify({ taskName, todoId }),
      'createTask',
      'POST',
      handleNewTask
    );
  }
};

const handleNewToDo = function() {
  const todo = JSON.parse(this.responseText);
  document.querySelector('.listIdDiv').id = todo.listId;
  document.querySelector('.headingTag').innerHTML = todo.title;
};

const createToDo = function(textBoxId) {
  const toDoName = document.getElementById(textBoxId).value;
  if (toDoName) {
    sendXHR(JSON.stringify({ toDoName }), 'createToDo', 'POST', handleNewToDo);
  }
};

const createTaskTemplate = function(task) {
  return `<input type="checkbox" name="checkBox" id="${task.id}" ${
    task.done ? 'checked' : ''
  } />${task.description}<br />`;
};

const sendXHR = function(data, url, method, responseHandler) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = responseHandler;
};
