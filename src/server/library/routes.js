const express = require('express');
const TODO_STORE_PATH = require(`${__dirname}/../../../config.js`);
const TodoStore = require('./todoStore');
const handlers = require('./handlers');

const app = express();
app.use(express.static(`${__dirname}/../../public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.locals.store = new TodoStore(TODO_STORE_PATH);
app.locals.store.initialize();

app.post('/login', handlers.loginHandler);
app.get('/getTodos', handlers.getTodos);
app.post('/createTodo', handlers.createTodo);
app.post('/editTodoTitle', handlers.editTodoTitle);
app.post('/deleteTodo', handlers.deleteTodo);
app.post('/createTask', handlers.createTask);
app.post('/editTaskCaption', handlers.editTaskCaption);
app.post('/editTaskStatus', handlers.editTaskStatus);
app.post('/deleteTask', handlers.deleteTask);

module.exports = app;
