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
  const [taskList, setTaskList] = useState<Task[]>([]);

  const handleAddTask = (newTask: Task) => {
    setTaskList([...taskList, newTask]);
  };

  const handleEditTask = (taskId: string, updatedTitle: string, updatedDescription: string) => {
    const updatedTaskList = taskList.map(task => 
      task.id === taskId ? { ...task, title: updatedTitle, description: updatedDescription } : task
    );
    setTaskList(updatedTaskList);
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    const updatedTaskList = taskList.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTaskList);
  };

  const handleDeleteTask = (taskId: string) => {
    const remainingTasks = taskList.filter(task => task.id !== taskId);
    setTaskList(remainingTasks);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm addTask={handleAddTask} />
      <TaskList
        tasks={taskList}
        toggleTaskCompletion={handleToggleTaskCompletion}
        deleteTask={handleDeleteTask}
        editTask={handleEditTask}
      />
    </div>
  );
};

export default TaskManager;