const express = require('express');
const TODO_STORE_PATH = require(`${__dirname}/../../config.js`);
const TodoStore = require('./library/todoStore');
const {
  getTodos,
  createTask,
  createTodo,
  deleteTask,
  deleteTodo,
  editTaskCaption,
  editTaskStatus,
  editTodoTitle
} = require('./library/handlers');

const PORT = 7000;
const app = express();
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());

app.locals.store = new TodoStore(TODO_STORE_PATH);
app.locals.store.initialize();

app.get('/getTodos', getTodos);
app.post('/createTodo', createTodo);
app.post('/editTodoTitle', editTodoTitle);
app.post('/deleteTodo', deleteTodo);
app.post('/createTask', createTask);
app.post('/editTaskCaption', editTaskCaption);
app.post('/editTaskStatus', editTaskStatus);
app.post('/deleteTask', deleteTask);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
