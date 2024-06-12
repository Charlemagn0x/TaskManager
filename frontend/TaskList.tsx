import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
}

const TasksListComponent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks`);
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const deleteTask = async (id: string) => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <h3>{task.title}</h2>
          <p>{task.description}</p>
          <button onClick={() => deleteTask(task.id)}>Delete Task</button>
        </div>
      ))}
    </div>
  );
};

export default TasksListComponent;