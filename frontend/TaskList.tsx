import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
}

const TasksListComponent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks`);
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks(tasks);
    }
  };

  const addTask = async () => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks`, newTask);
    setTasks([...tasks, response.data]);
    setNewTask({ title: '', description: '' }); // Reset form
  };

  return (
    <div className="task-list">
      <div className="add-task">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        ></textarea>
        <button onClick={addTask}>Add Task</button>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => deleteTask(task.id)}>Delete Task</button>
        </div>
      ))}
    </div>
  );
};

export default TasksListComponent;