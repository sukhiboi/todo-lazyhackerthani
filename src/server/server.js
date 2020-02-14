const express = require('express');
const TODO_STORE_PATH = require(`${__dirname}/../../config.js`);
const TodoStore = require('./library/todoStore');
const TodoApp = require('./library/todoApp');

const PORT = 7000;
const app = express();
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());

const store = new TodoStore(TODO_STORE_PATH);
store.initialize();
const todoApp = new TodoApp(app);

app.get('/getTodos', todoApp.getTodos.bind(store));
app.post('/createTodo', todoApp.createTodo.bind(store));
app.post('/editTodoTitle', todoApp.editTodoTitle.bind(store));
app.post('/deleteTodo', todoApp.deleteTodo.bind(store));
app.post('/createTask', todoApp.createTask.bind(store));
app.post('/editTaskCaption', todoApp.editTaskCaption.bind(store));
app.post('/editTaskStatus', todoApp.editTaskStatus.bind(store));
app.post('/deleteTask', todoApp.deleteTask.bind(store));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
