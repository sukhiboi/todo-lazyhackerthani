const hide = id => (document.getElementById(id).style.display = 'none');

const show = id => (document.getElementById(id).style.display = 'block');

const clearValue = id => (document.getElementById(id).value = '');

const createTask = function(textBoxId, todoId) {
  const taskName = document.getElementById(textBoxId).value;
  if (taskName) {
    sendXHR(
      JSON.stringify({ taskName, todoId }),
      'createTask',
      'POST',
      handleAllToDo
    );
  }
};

const showEditTask = function(taskId) {
  const label = document.getElementById(`descriptionOf${taskId}`);
  const description = label.innerHTML;
  const input = `<input type="text" id="editedDescriptionOf${taskId}" class="smallerTextBox" value="${description}"/>`;
  label.innerHTML = input;
  const editIconSpan = document.getElementById(`editIconFor${taskId}`);
  const saveIcon = `<i id="saveIconFor${taskId}" class="fa fa-floppy-o" aria-hidden="true" onclick="editTask('editedDescriptionOf${taskId}','${taskId}')"></i>`;
  editIconSpan.innerHTML = saveIcon;
};

const editTask = function(textBoxId, taskId) {
  const taskText = document.getElementById(textBoxId).value;
  if (taskText) {
    sendXHR(
      JSON.stringify({ taskText, taskId }),
      'editTask',
      'POST',
      handleAllToDo
    );
  } else alert('type something in text box and save');
};

const editTaskStatus = function(taskId) {
  sendXHR(JSON.stringify({ taskId }), 'editTaskStatus', 'POST', () => {});
};

const deleteTask = taskId =>
  sendXHR(JSON.stringify({ taskId }), 'deleteTask', 'POST', handleAllToDo);

const createToDo = function(textBoxId) {
  const toDoName = document.getElementById(textBoxId).value;
  if (toDoName) {
    sendXHR(JSON.stringify({ toDoName }), 'createToDo', 'POST', handleAllToDo);
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
  const html = `<div class="stickNote" id="div${todo.listId}">
            <img id="edit${todo.listId}" class="editTodoIcon" src="./images/editTodoIcon.png" alt="edit" />
            <img id="delete${todo.listId}"  class="deleteTodoIcon" src="./images/deleteTodoIcon.png" alt="delete" />
             <div class="stickyTitle">
               <h2 >${todo.title}&nbsp
               <i class="fa fa-chevron-down" aria-hidden="true" onclick="show('input${todo.listId}')"></i>
               </h2>
             </div>
             <div class="smallTextBoxDiv hideIt" id="input${todo.listId}">
               <input type="text"  class="smallTextBox" name="stickyInputBox" id="taskTo${todo.listId}" placeholder="type task and enter"/>
               <i  id="addIconFor${todo.listId}" class="fa fa-plus-circle" aria-hidden="true" onclick="createTask('taskTo${todo.listId}','${todo.listId}')"></i>&nbsp
               <i id="cancelIconFor${todo.listId}" class="fa fa-times-circle" aria-hidden="true" onclick="hide('input${todo.listId}'),clearValue('taskTo${todo.listId}')"></i>
             </div><br>
            <div id="tasksOf${todo.listId}">
              ${tasksInHtml}
            </div>
          </div>`;
  return html;
};

const createTaskTemplate = function(task) {
  return `<div class="taskDiv" id="${
    task.id
  }"><input type="checkbox" name="checkBox" onclick="editTaskStatus('${
    task.id
  }')" id="checkbox${task.id}" ${
    task.done ? 'checked' : ''
  } /><label id="descriptionOf${task.id}" for="checkbox${task.id}">${
    task.description
  }</label>&emsp;<span id="editIconFor${
    task.id
  }"><i  class="fa fa-pencil-square-o" aria-hidden="true" onclick="showEditTask('${
    task.id
  }')"></i>&nbsp<i id="deleteIconFor${
    task.id
  }" class="fa fa-times-circle" aria-hidden="true" onclick="deleteTask('${
    task.id
  }')"></i></span></div><br />`;
};

const sendXHR = function(data, url, method, responseHandler) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = responseHandler;
};
