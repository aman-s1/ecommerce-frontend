import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referral: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check for empty fields
    for (const key of Object.keys(formData)) {
      if (formData[key as keyof typeof formData].trim() === "" && key !== "referral") {
        setError(`${key.charAt(0).toUpperCase() + key.slice(1)} field should not be empty`);
        return;
      }
    }
  
    // Validate email format
    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    // Send data to the backend
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referral: formData.referral // Include referral if needed
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        setError(`Signup failed: ${errorData.err}`);
        return;
      }
  
      setError(null);
      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      setError(`Signup failed: ${(error as Error).message}`);
    }
  };  

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
        />
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
        />
        <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
        />
        <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
        />
        <input
            type="text"
            name="referral"
            value={formData.referral}
            onChange={handleChange}
            placeholder='Referral Id'
        />
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <a href="/login">Already have an account? Login here</a>
    </div>
  );
};

export default SignUp;
