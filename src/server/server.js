const express = require('express');
const TODO_STORE_PATH = require(`${__dirname}/../../config.js`);
const TodoStore = require('./library/todoStore');
const TodoApp = require('./library/todoApp');

const PORT = 7000;
const app = express();
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());

const todoApp = new TodoApp(app, new TodoStore(TODO_STORE_PATH));
todoApp.initialize();

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
