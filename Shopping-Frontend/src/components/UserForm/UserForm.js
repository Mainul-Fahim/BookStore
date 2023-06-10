// UserForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = ({ handleUserCreation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to create a new user
    try {
      const response = await axios.post('http://localhost:4000/api/customers', { name, email, password });
      handleUserCreation(response.data.customerId);
    } catch (error) {
      console.error(error);
      // Handle error state or display an error message to the user
    }
  };

  return (
    <div className="user-form-container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default UserForm;
