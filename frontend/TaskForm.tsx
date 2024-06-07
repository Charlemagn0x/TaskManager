import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null); // New state for form submission error handling

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setFormError(null); // Reset form error when user starts typing
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setCsssFormError(null); // Reset form error when user starts typing
  };

  // Reset the form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!BACKEND_URL) {
      console.error('BACKEND_URL is not defined. Please add REACT_APP_BACKEND_URL to your .env file.');
      return;
    }

    const taskData = {
      title,
      description,
    };

    try {
      await axios.post(`${BACKEND_URL}/tasks`, taskData);
      
      resetForm(); // Reset the form upon successful submission

      // You might also consider adding a success message state and display it here
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error saving the task:', error.message);
        setFormError('Failed to save the task. Please try again.'); // Set form error for user feedback
      } else {
        console.error('Unexpected error:', error);
        setFormError('An unexpected error occurred. Please try again.'); // Set generic form error
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form error display */}
      {formError && <p style={{ color: 'red' }}>{formError}</p>}

      <div>
        <label htmlFor="title">Task Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          required
        />
      </div>
      <button type="submit">Add Task</Button>
    </form>
  );
};

export default TaskForm;