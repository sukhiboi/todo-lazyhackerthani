const express = require('express');
const TODO_STORE_PATH = require(`${__dirname}/../../config.js`);
const TodoStore = require('./library/todoStore');
const TodoApp = require('./library/todoApp');

const PORT = 7000;
const app = express();
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());

app.locals.store = new TodoStore(TODO_STORE_PATH);
app.locals.store.initialize();
const todoApp = new TodoApp();

app.get('/getTodos', todoApp.getTodos);
app.post('/createTodo', todoApp.createTodo);
app.post('/editTodoTitle', todoApp.editTodoTitle);
app.post('/deleteTodo', todoApp.deleteTodo);
app.post('/createTask', todoApp.createTask);
app.post('/editTaskCaption', todoApp.editTaskCaption);
app.post('/editTaskStatus', todoApp.editTaskStatus);
app.post('/deleteTask', todoApp.deleteTask);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
