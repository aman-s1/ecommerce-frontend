import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty fields
    if (!email.trim() || !password.trim()) {
      setError('Email and Password are required');
      return;
    }

    // Send data to the backend
    try {
      const response = await fetch('https://ecommerce-backend-rnh6j2c3d-aman-s1s-projects.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Login failed: ${errorData.err}`);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setError(null);
      // Redirect to dashboard
      navigate('/shop');
    } catch (error) {
      setError(`Login failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <a href="/signup">Don't have an account? Sign up here</a>
    </div>
  );
};

export default Login;
