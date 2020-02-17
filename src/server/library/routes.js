const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {
  DATA_STORE_PATH,
  USERS_PATH
} = require(`${__dirname}/../../../config.js`);
const TodosStore = require('./todosStore');
const handlers = require('./handlers');
const UserCollection = require('./userCollection');

const rawUsersCollection = fs.readFileSync(USERS_PATH, 'utf8');
const rawDataStore = fs.readFileSync(DATA_STORE_PATH, 'utf8');

const app = express();
app.use(express.static(`${__dirname}/../../public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.locals.allUsers = UserCollection.load(rawUsersCollection);
app.locals.store = TodosStore.load(rawDataStore);

app.post('/signup', handlers.signupHandler);
app.post('/login', handlers.loginHandler);
app.use(handlers.validateSession);
app.get('/getTodos', handlers.getTodos);
app.post('/createTodo', handlers.createTodo);
app.post('/editTodoTitle', handlers.editTodoTitle);
app.post('/deleteTodo', handlers.deleteTodo);
app.post('/createTask', handlers.createTask);
app.post('/editTaskCaption', handlers.editTaskCaption);
app.post('/editTaskStatus', handlers.editTaskStatus);
app.post('/deleteTask', handlers.deleteTask);

module.exports = app;
