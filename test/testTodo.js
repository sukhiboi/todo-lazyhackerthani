const assert = require('chai').assert;
const {
  Task,
  TaskList,
  ToDo,
  ToDoList
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
  describe('editStatus', function() {
    it('should change the status to done when it is inComplete', function() {
      const task = new Task('buy milk', date, 'task1');
      task.editStatus();
      assert.deepStrictEqual(task, {
        caption: 'buy milk',
        time: date,
        id: 'task1',
        done: true
      });
    });
    it('should change the status to undone when it is complete', function() {
      const task = new Task('buy milk', date, 'task1', true);
      task.editStatus();
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
describe('ToDoList', function() {
  describe('toJSON', function() {
    it('should give json string of its own data', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoList = ToDoList.load(jsonString);
      assert.strictEqual(toDoList.toJSON(), jsonString);
    });
  });
  describe('has', function() {
    it('should say true if the given id is present in todoList', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoList = ToDoList.load(jsonString);
      assert.isTrue(toDoList.has('list1'));
    });
    it('should say false if the given id is not present in todoList', function() {
      const jsonString =
        '[{"title":"page_today","listId":"list1","startDate":"2020-02-04T04:19:21.661Z","tasks":[{"caption":"go to office","id":"task1","time":"2020-02-04T04:19:30.857Z","done":false},{"caption":"go to market","id":"task2","time":"2020-02-04T04:19:30.857Z","done":false}]}]';
      const toDoList = ToDoList.load(jsonString);
      assert.isFalse(toDoList.has('list2'));
    });
  });
});
