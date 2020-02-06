const hide = id => (document.getElementById(id).style.display = 'none');

const show = id => (document.getElementById(id).style.display = 'block');

const createTask = function(textBoxId) {
  const taskName = document.getElementById(textBoxId).value;
  const todoId = document.querySelector('.listIdDiv').id;
  if (taskName) {
    sendXHR(JSON.stringify({ taskName, todoId }), 'createTask', 'POST');
  }
};

const createTaskTemplate = function(task) {
  return `<input type="checkbox" name="checkBox" id="${task.id}" ${
    task.done ? 'checked' : ''
  } />${task.description}<br />`;
};

const formatResponse = function() {
  const task = JSON.parse(this.responseText);
  const todoId = document.querySelector('.listIdDiv').id;
  const taskInHtml = createTaskTemplate(task);
  console.log(taskInHtml);

  document.getElementById(todoId).innerHTML += taskInHtml;
};

const sendXHR = function(data, url, method) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = formatResponse;
};
