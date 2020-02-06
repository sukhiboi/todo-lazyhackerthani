const hide = id => (document.getElementById(id).style.display = 'none');

const show = id => (document.getElementById(id).style.display = 'block');

const clearValue = id => (document.getElementById(id).value = '');

const handleNewTask = function() {
  const task = JSON.parse(this.responseText);
  const todoId = document.querySelector('.listIdDiv').id;
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

const createToDo = function(textBoxId, windowId) {
  const toDoName = document.getElementById(textBoxId).value;
  if (toDoName) {
    sendXHR(JSON.stringify({ toDoName }), 'createToDo', 'POST', handleNewToDo);
    show(windowId);
  }
};

const loadToDos = () => sendXHR({}, 'getToDos', 'GET', handleAllToDo);

const handleAllToDo = function() {
  const todoList = JSON.parse(this.responseText);
  const html = todoList
    .map(todo => {
      return createStickyTemplate(todo);
    })
    .join('');
  document.getElementById('mainBox').innerHTML = html;
};

const createStickyTemplate = function(todo) {
  const tasksInHtml = todo.tasks
    .map(task => {
      return createTaskTemplate(task);
    })
    .join('');
  return `<div class="stickNote" id="${todo.listId}">
        <div>
          <h2 class="stickyTitle">${todo.title}</h2>
          <img id="todoEditIcon" src="./images/editTodoIcon.png" alt="edit" />
        </div>
        <div>
          ${tasksInHtml}
        </div>
      </div>`;
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
