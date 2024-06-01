import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (taskToAdd: Task) => {
    setTasks([...tasks, taskToAdd]);
  };

  const editTask = (taskId: string, updatedTitle: string, updatedDescription: string) => {
    const tasksWithUpdated = tasks.map(task => 
      task.id === taskId ? { ...task, title: updatedHolderTitle, description: updatedHolderDescription } : task
    );
    setTasks(tasksWithUpdated);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const tasksWithToggledCompletion = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(tasksWithToggledCompletion);
  };

  const deleteTask = (taskId: string) => {
    const tasksAfterDeletion = tasks.filter(task => task.id !== taskId);
    setTasks(tasksAfterDeletion);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm addTask={addTask} />
      <TaskList
        tasks={tasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
};

export default TaskManager;