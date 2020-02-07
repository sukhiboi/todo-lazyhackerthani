const hide = id => (document.getElementById(id).style.display = 'none');

const show = id => (document.getElementById(id).style.display = 'block');

const clearValue = id => (document.getElementById(id).value = '');

const handleNewTask = function() {
  const task = JSON.parse(this.responseText);
  const todoDivId = document.querySelector('.listIdDiv').id;
  const taskInHtml = createTaskTemplate(task);
  document.getElementById(todoDivId).innerHTML += taskInHtml;
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
  return `<div class="stickNote" id="div${todo.listId}">
            <img id="edit${todo.listId}" class="editTodoIcon" src="./images/editTodoIcon.png" alt="edit" />
            <img id="delete${todo.listId}"  class="deleteTodoIcon" src="./images/deleteTodoIcon.png" alt="delete" />
             <div class="stickyTitle">
               <h2 >${todo.title}&nbsp
               <i class="fa fa-chevron-down" aria-hidden="true" onclick="show('input${todo.listId}')"></i>
               </h2>
             </div>
             <div class="smallTextBoxDiv hideIt" id="input${todo.listId}">
               <input type="text"  class="smallTextBox" name="stickyInputBox" id="taskTo${todo.listId}" placeholder="type task and enter"/>
               <i class="fa fa-plus-circle" aria-hidden="true" ></i>&nbsp
               <i class="fa fa-times-circle" aria-hidden="true" onclick="hide('input${todo.listId}'),clearValue('taskTo${todo.listId}')"></i>
             </div><br>
            <div id="tasksOf${todo.listId}">
              ${tasksInHtml}
            </div>
          </div>`;
};

const createTaskTemplate = function(task) {
  return `<div class="taskDiv" id="${
    task.id
  }"><input type="checkbox" name="checkBox" id="checkbox${task.id}" ${
    task.done ? 'checked' : ''
  } /><label for="checkbox${task.id}">${task.description}</label><img id="edit${
    task.id
  }" src="./images/editTaskIcon.png" alt="edit" class="taskEditIcon" /><img id="delete${
    task.id
  }" src="./images/deleteTaskIcon.png" alt="delete" class="taskDeleteIcon" /></div><br />`;
};

const sendXHR = function(data, url, method, responseHandler) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = responseHandler;
};
