import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TaskForm: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Update task title
  const onTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
    if (submissionError) setSubmissionError(null); // Reset submission error when user starts typing
  };

  // Update task description
  const onTaskDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(e.target.value);
    if (submissionError) setSubmissionError(null); // Reset submission error when user starts typing
  };

  // Clear form fields
  const clearFormFields = () => {
    setTaskTitle('');
    setTaskDescription('');
  }

  // Form submission handler
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!BACKEND_URL) {
      console.error('BACKEND_URL is not defined. Ensure REACT_APP_BACKEND_URL is in your .env file.');
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
    };

    try {
      await axios.post(`${BACKEND_URL}/tasks`, newTask);
      
      clearFormFields(); // Clear form on successful submit

      // Consider implementing a success message state and displaying it
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error saving the task with Axios:', error.message);
        setSubmissionError('Failed to save task. Please retry.'); // User feedback on failure
      } else {
        console.error('Unexpected error:', error);
        setSubmissionError('Unexpected error occurred. Please retry.'); // Generic error for unforeseen issues
      }
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      {/* Display submission errors if any */}
      {submissionError && <p style={{ color: 'red' }}>{submissionError}</p>}

      <div>
        <label htmlFor="title">Task Title</label>
        <input
          type="text"
          id="title"
          value={taskTitle}
          onChange={onTaskTitleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={taskDescription}
          onChange={onTaskDescriptionChange}
          required
        />
      </div>
      <button type="submit">Add Task</button> {/* Corrected the button element */}
    </form>
  );
};

export default TaskForm;