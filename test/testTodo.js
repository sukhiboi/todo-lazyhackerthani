const assert = require('chai').assert;
const {
  Task,
  TaskList,
  ToDo,
  ToDoStore
} = require('../src/server/library/todoList');

let date;

beforeEach(function() {
  date = new Date();
});

describe('Task class', function() {
  describe('toJSON', function() {
    it('should generate JSON when task is inComplete', function() {
      const task = new Task('buy milk', date, 'task1');
      const jsonString = `{"caption":"buy milk","id":"task1","time":"${date.toJSON()}","done":false}`;
      assert.strictEqual(task.toJSON(), jsonString);
    });
  });
  describe('toggleStatus', function() {
    it('should change the status to done when it is inComplete', function() {
      const task = new Task('buy milk', date, 'task1');
      task.toggleStatus();
      assert.deepStrictEqual(task, {
        caption: 'buy milk',
        time: date,
        id: 'task1',
        done: true
      });
    });
    it('should change the status to undone when it is complete', function() {
      const task = new Task('buy milk', date, 'task1', true);
      task.toggleStatus();
      assert.deepStrictEqual(task, {
        caption: 'buy milk',
        time: date,
        id: 'task1',
        done: false
      });
    });
  });
  describe('editCaption', function() {
    it('should edit the caption of the Task', function() {
      const task = new Task('buy milk', date, 'task1');
      task.editCaption('buy shampoo');
      assert.deepStrictEqual(task, {
        caption: 'buy shampoo',
        time: date,
        id: 'task1',
        done: false
      });
    });
  });
});

describe('TaskList', function() {
  let task;

  beforeEach(function() {
    task = new Task('something', date, 'task2');
  });

  describe('addTask', function() {
    it('should add a new task in the list', function() {
      const list = new TaskList();
      list.addTask(task);
      assert.deepStrictEqual(list, { list: [task] });
    });
  });

  describe('findTask', function() {
    it('should find a task with valid id', function() {
      const list = new TaskList();
      list.addTask(task);
      const task3 = new Task('something_big', date, 'task3', true);
      list.addTask(task3);
      const foundedTask = list.findTask('task3');
      assert.deepStrictEqual(foundedTask, task3);
    });
    it('should return undefined when no task found', function() {
      const list = new TaskList();
      const foundedTask = list.findTask('badTaskId');
      assert.deepStrictEqual(foundedTask, undefined);
    });
  });

  describe('editTaskCaption', function() {
    it('should edit task caption for given taskId', function() {
      const list = new TaskList();
      list.addTask(task);
      list.editTaskCaption('task2', 'edited');
      assert.deepStrictEqual(list, {
        list: [{ caption: 'edited', time: date, id: 'task2', done: false }]
      });
    });
  });

  describe('editTaskStatus', function() {
    it('should edit task status of the task with given taskId', function() {
      const list = new TaskList();
      list.addTask(task);
      list.editTaskStatus('task2');
      assert.deepStrictEqual(list, {
        list: [{ caption: 'something', time: date, id: 'task2', done: true }]
      });
    });
  });

  describe('deleteTask', function() {
    it('should delete the task with given id', function() {
      const list = new TaskList();
      list.addTask(task);
      list.deleteTask('task2');
      assert.deepStrictEqual(list, {
        list: []
      });
    });
    it('should NOT delete the task if given id not found', function() {
      const list = new TaskList();
      list.addTask(task);
      list.deleteTask('task6');
      assert.deepStrictEqual(list, {
        list: [task]
      });
    });
  });

  describe('load', function() {
    it('should load the tasks from an array of objects which have properties of a task', function() {
      const rawTasks = [
        { caption: 'somethingBig', time: date, id: 'task89', done: false }
      ];
      const list = TaskList.load(rawTasks);
      assert.ok(list['list'][0] instanceof Task);
      const expected = {
        list: [
          {
            caption: 'somethingBig',
            time: date,
            id: 'task89',
            done: false
          }
        ]
      };
      assert.deepStrictEqual(list, expected);
    });
  });

  describe('toJSON', function() {
    it('should give json string of list', function() {
      const content = [
        {
          caption: 'go to office',
          id: 'task1',
          time: '2020-02-04T04:19:30.857Z',
          done: false
        },
        {
          caption: 'go to market',
          id: 'task2',
          time: '2020-02-04T04:19:30.857Z',
          done: false
        }
      ];
      const taskList = TaskList.load(content);
      const jsonString =
        '[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]';
      assert.strictEqual(taskList.toJSON(), jsonString);
    });
  });
});

describe('ToDo', function() {
  describe('addTask', function() {
    it('should add a task', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      const expected = {
        title: 'Home',
        listId: 'todo1',
        startDate: date,
        tasks: {
          list: [task]
        }
      };
      assert.deepStrictEqual(todo, expected);
    });
  });

  describe('findTask', function() {
    it('should find a task with a given id', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task9', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.addTask(task2);
      const foundedTask = todo.findTask('task9');
      assert.deepStrictEqual(foundedTask, task2);
    });

    it('should give undefined when the given id is not found', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task9', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.addTask(task2);
      const foundedTask = todo.findTask('task90');
      assert.isUndefined(foundedTask);
    });
  });

  describe('editTaskCaption', function() {
    it('should edit the caption of the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.editTaskCaption('task1', 'buy dove shampoo');
      assert.deepStrictEqual(task.caption, 'buy dove shampoo');
    });
  });

  describe('editTaskStatus', function() {
    it('should toggle the status of the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.editTaskStatus('task1');
      assert.isFalse(task.done);
    });

    it('should toggle the status of the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.editTaskStatus('task1');
      assert.isTrue(task.done);
    });
  });

  describe('deleteTask', function() {
    it('should delete the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task7', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.addTask(task2);
      todo.deleteTask('task1');
      assert.deepStrictEqual(todo.tasks, { list: [task2] });
    });

    it("should NOT delete any other tasks when taskId doesn't found", function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task7', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.addTask(task);
      todo.addTask(task2);
      todo.deleteTask('task90');
      assert.deepStrictEqual(todo.tasks, { list: [task, task2] });
    });
  });

  describe('editTitle', function() {
    it('should edit the title of the todo', function() {
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      todo.editTitle('new Title');
      assert.deepStrictEqual(todo.title, 'new Title');
    });
  });

  describe('load', function() {
    it('should load the todo from object which have properties of a todo', function() {
      const rawTodo = {
        title: 'raw Todo',
        startDate: date,
        listId: 'todo2',
        tasks: [{ caption: 'new Task', time: date, done: false, id: 'task4' }]
      };
      const todo = ToDo.load(rawTodo);
      assert.ok(todo.tasks instanceof TaskList);
      assert.ok(todo.tasks.list[0] instanceof Task);
    });
  });

  describe('toJSON', function() {
    it('should give json string of its own data', function() {
      const content = {
        title: 'page_today',
        listId: 'list1',
        startDate: '2020-02-04T04:19:21.661Z',
        tasks: [
          {
            caption: 'go to office',
            id: 'task1',
            time: '2020-02-04T04:19:30.857Z',
            done: false
          },
          {
            caption: 'go to market',
            id: 'task2',
            time: '2020-02-04T04:19:30.857Z',
            done: false
          }
        ]
      };
      const toDo = ToDo.load(content);
      const jsonString =
        '{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}';
      assert.strictEqual(toDo.toJSON(), jsonString);
    });
  });
});

describe.skip('ToDoStore', function() {
  describe('addTodo', function() {
    it('should add a todo to the list', function() {
      const todoList = new ToDoStore();
      const todo = new ToDo('new Todo', date, new TaskList(), 'todo1');
      todoList.addToDo(todo);
      assert.deepStrictEqual(todoList, { list: [todo] });
    });
  });

  describe('addTask', function() {
    it('should add a task', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      const expected = {
        list: [
          {
            title: 'Home',
            listId: 'todo1',
            startDate: date,
            tasks: {
              list: [task]
            }
          }
        ]
      };
      assert.deepStrictEqual(todoList, expected);
    });
  });

  describe('findTask', function() {
    it('should find a task with a given id', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task9', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.addTask('todo1', task2);
      const foundedTask = todoList.findTask('task9');
      assert.deepStrictEqual(foundedTask, task2);
    });

    it('should give undefined when the given id is not found', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task9', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.addTask('todo1', task2);
      const foundedTask = todoList.findTask('task90');
      assert.isUndefined(foundedTask);
    });
  });

  describe('editTaskCaption', function() {
    it('should edit the caption of the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.editTaskCaption('task1', 'buy dove shampoo');
      assert.deepStrictEqual(task.caption, 'buy dove shampoo');
    });
  });

  describe('editTaskStatus', function() {
    it('should toggle the status of the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.editTaskStatus('task1');
      assert.isFalse(task.done);
    });

    it('should toggle the status of the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.editTaskStatus('task1');
      assert.isTrue(task.done);
    });
  });

  describe('deleteTask', function() {
    it('should delete the task with matching taskId', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task7', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.addTask('todo1', task2);
      todoList.deleteTask('task1');
      assert.deepStrictEqual(todoList.list[0].tasks.list, [task2]);
    });

    it("should NOT delete any other tasks when taskId doesn't found", function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const task2 = new Task('buy dove shampoo', date, 'task7', false);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.addTask('todo1', task2);
      todoList.deleteTask('task10');
      assert.deepStrictEqual(todoList.list[0].tasks.list, [task, task2]);
    });
  });

  describe('editTaskStatus', function() {
    it('should edit the status of the task with matching id', function() {
      const task = new Task('buy shampoo', date, 'task1', true);
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addTask('todo1', task);
      todoList.editTaskStatus('task1');
      assert.isFalse(todoList.list[0].tasks.list[0].done);
    });
  });

  describe('deleteTodo', function() {
    it('should delete Todo with the given Id', function() {
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todo2 = new ToDo('Office', date, new TaskList(), 'todo19');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addToDo(todo2);
      todoList.deleteToDo('todo1');
      assert.deepStrictEqual(todoList.list, [todo2]);
    });

    it('should NOT delete Todo when the given Id not found', function() {
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todo2 = new ToDo('Office', date, new TaskList(), 'todo19');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addToDo(todo2);
      todoList.deleteToDo('todo18');
      assert.deepStrictEqual(todoList.list, [todo, todo2]);
    });
  });

  describe('findTodo', function() {
    it('should find todo with the give id', function() {
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todo2 = new ToDo('Office', date, new TaskList(), 'todo19');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addToDo(todo2);
      const foundedTodo = todoList.findToDo('todo19');
      assert.deepStrictEqual(foundedTodo, todo2);
    });

    it('should give undefined when todo with given todoId not found', function() {
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todo2 = new ToDo('Office', date, new TaskList(), 'todo19');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.addToDo(todo2);
      const foundedTodo = todoList.findToDo('todo190');
      assert.isUndefined(foundedTodo);
    });
  });

  describe('editTodoTitle', function() {
    it('should edit the title with matching todoId', function() {
      const todo = new ToDo('Home', date, new TaskList(), 'todo1');
      const todoList = new ToDoStore();
      todoList.addToDo(todo);
      todoList.editToDoTitle('todo1', 'Office');
      assert.deepStrictEqual(todoList.list[0].title, 'Office');
    });
  });

  describe('load', function() {
    it('should load the todoList from JSON string', function() {
      const todoListRaw = [
        {
          title: 'page_today',
          listId: 'list1',
          startDate: date,
          tasks: [
            {
              caption: 'go to market',
              id: 'task2',
              time: date,
              done: false
            }
          ]
        }
      ];
      const jsonString = JSON.stringify(todoListRaw);
      const todoList = ToDoStore.load(jsonString);
      assert.deepStrictEqual(todoList, {
        list: [
          {
            listId: 'list1',
            startDate: date,
            title: 'page_today',
            tasks: {
              list: [
                {
                  caption: 'go to market',
                  id: 'task2',
                  time: date,
                  done: false
                }
              ]
            }
          }
        ]
      });
    });
  });

  describe('toJSON', function() {
    it('should give json string of its own data', function() {
      const jsonString = `[{"title":"page_today","listId":"list1","startDate":"${date.toJSON()}","tasks":[{"caption":"go to office","id":"task1","time":"${date.toJSON()}","done":false},{"caption":"go to market","id":"task2","time":"${date.toJSON()}","done":false}]}]`;
      const toDoStore = ToDoStore.load(jsonString);
      assert.strictEqual(toDoStore.toJSON(), jsonString);
    });
  });

  describe('has', function() {
    it('should say true if the given id is present in todoList', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoStore = ToDoStore.load(jsonString);
      assert.isTrue(toDoStore.has('list1'));
    });
    it('should say false if the given id is not present in todoList', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoStore = ToDoStore.load(jsonString);
      assert.isFalse(toDoStore.has('list2'));
    });
  });
});
