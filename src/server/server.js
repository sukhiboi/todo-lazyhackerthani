const http = require('http');

const TODO_STORE_PATH = require(`${__dirname}/../../config.js`);
const TodoStore = require('./library/todoStore');
const TodoApp = require('./library/todoApp');

const todoApp = new TodoApp(new TodoStore(TODO_STORE_PATH));
todoApp.initialize();

const server = new http.Server((req, res) => todoApp.serve(req, res));

server.listen(7000, () => console.log('listening to 7000'));
