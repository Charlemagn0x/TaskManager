import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TaskForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

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
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error saving the task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Task Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleDescription}
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
            </discount>
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;