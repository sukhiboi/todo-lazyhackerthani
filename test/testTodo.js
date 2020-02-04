const assert = require('chai').assert;
const {
  Task,
  TaskList,
  ToDo,
  ToDoList
} = require('../src/server/library/todo');

describe('Task class', function() {
  describe('toHTML', function() {
    it('should  give html string according to its data without checked when its not done', function() {
      const date = new Date();
      const task = new Task('buy milk', 'task1', date);
      const html = `<input type="checkbox" name="checkBox" id="task1"  />buy milk<br />`;
      assert.strictEqual(task.toHTML(), html);
    });
    it('should  give html string according to its data with checked when its done', function() {
      const date = new Date();
      const task = new Task('buy milk', 'task1', date, true);
      const html = `<input type="checkbox" name="checkBox" id="task1" checked />buy milk<br />`;
      assert.strictEqual(task.toHTML(), html);
    });
  });
});
describe('TaskList', function() {
  describe('toHTML', function() {
    it('should give html string according to its data ', function() {
      const content = [
        {
          description: 'go to office',
          time: '2020-02-04T04:19:30.857Z',
          done: false,
          id: 'task1'
        },
        {
          description: 'go to office',
          time: '2020-02-04T04:19:30.857Z',
          done: false,
          id: 'task1'
        }
      ];
      const taskList = TaskList.load(content);
      const html =
        '<input type="checkbox" name="checkBox" id="task1"  />go to office<br /><input type="checkbox" name="checkBox" id="task1"  />go to office<br />';
      assert.strictEqual(taskList.toHTML(), html);
    });
  });
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
});
