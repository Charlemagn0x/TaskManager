import React, { useState } from 'react';
import useLocalStorage from './useLocalStorage';

interface Task {
  id: number;
  text: string;
}

function TaskApp() {
  const [tasks, setTasks, clearTasks] = useLocalStorage<Task[]>('tasks', []);
  const [taskInput, setTaskInput] = useState('');

  const addTask = () => {
    if (taskInput !== '') {
      const newTask = { id: Date.now(), text: taskInput };
      setTasks([...tasks, newTask]);
      setTaskInput('');
    }
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        onKeyPress={(e) => { if(e.key === 'Enter') { addTask(); }}}
      />
      <button onClick={addTask}>Add Task</button>
      <button onClick={clearTasks}>Clear All Tasks</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.text}
            <button onClick={() => remove1024(removeTask(task.id)} style={{marginLeft: '10px'}}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskApp;
```
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';

ReactDOM.render(
  <React.StrictMode>
    <TaskApp />
  </React.StrictMode>,
  document.getElementById('root')
);