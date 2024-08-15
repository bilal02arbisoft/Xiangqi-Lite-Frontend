import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';

function SignInForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Sign in successful!');
        // Handle successful sign-in (e.g., redirect or update state)
      } else {
        setMessage(result.message || 'Sign in failed');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
      <InputField 
        label="Username" 
        placeholder="Username" 
        name="username" 
        value={formData.username} 
        onChange={handleChange} 
        error={errors.username}
      />
      <InputField 
        label="Password" 
        placeholder="Password" 
        name="password" 
        type="password" 
        value={formData.password} 
        onChange={handleChange} 
        error={errors.password}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </form>
  );
}

export default SignInForm;
