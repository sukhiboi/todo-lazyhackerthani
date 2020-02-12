const http = require('http');

const TODO_STORE_PATH = require(`${__dirname}/../../config.js`);
const { ToDoStore } = require('./library/todoList');
const { TodoApp } = require('./library/TodoApp');

const todoApp = new TodoApp(new ToDoStore(TODO_STORE_PATH));
todoApp.initialize();

const server = new http.Server((req, res) => todoApp.serve(req, res));

server.listen(7000, () => console.log('listening to 4000'));
