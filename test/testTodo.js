const assert = require('chai').assert;
const {
  Task,
  TaskList,
  ToDo,
  ToDoList
} = require('../src/server/library/todoList');

describe('Task class', function() {
  describe('toJSON', function() {
    it('should  give JSON string according to its data', function() {
      const date = new Date('2020-02-06T04:14:39.160Z');
      const task = new Task('buy milk', date, 'task1', true);
      const jsonString =
        '{"description":"buy milk","id":"task1","time":"2020-02-06T04:14:39.160Z","done":true}';
      assert.strictEqual(task.toJSON(), jsonString);
    });
  });
});
describe('TaskList', function() {
  describe('toJSON', function() {
    it('should give json string of list', function() {
      const content = [
        {
          description: 'go to office',
          id: 'task1',
          time: '2020-02-04T04:19:30.857Z',
          done: false
        },
        {
          description: 'go to market',
          id: 'task2',
          time: '2020-02-04T04:19:30.857Z',
          done: false
        }
      ];
      const taskList = TaskList.load(content);
      const jsonString =
        '[{"description":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"description":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]';
      assert.strictEqual(taskList.toJSON(), jsonString);
    });
  });
});

describe('ToDo', function() {
  describe('toJSON', function() {
    it('should give json string of its own data', function() {
      const content = {
        title: 'page_today',
        listId: 'list1',
        startDate: '2020-02-04T04:19:21.661Z',
        tasks: [
          {
            description: 'go to office',
            id: 'task1',
            time: '2020-02-04T04:19:30.857Z',
            done: false
          },
          {
            description: 'go to market',
            id: 'task2',
            time: '2020-02-04T04:19:30.857Z',
            done: false
          }
        ]
      };
      const toDo = ToDo.load(content);
      const jsonString =
        '{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"description":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"description":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}';
      assert.strictEqual(toDo.toJSON(), jsonString);
    });
  });
});
describe('ToDoList', function() {
  describe('toJSON', function() {
    it('should give json string of its own data', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"description":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"description":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoList = ToDoList.load(jsonString);
      assert.strictEqual(toDoList.toJSON(), jsonString);
    });
  });
  describe('has', function() {
    it('should say true if the given id is present in todoList', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"description":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"description":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoList = ToDoList.load(jsonString);
      assert.isTrue(toDoList.has('list1'));
    });
    it('should say false if the given id is not present in todoList', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"description":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"description":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoList = ToDoList.load(jsonString);
      assert.isFalse(toDoList.has('list2'));
    });
  });
});
