import React, { useState } from 'react';
import InputField from 'components/InputField';
import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';


function SignInForm() {
  const navigate = useNavigate();
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await response.json();
      if (response.ok) {
        // Extract the tokens from the response
        const { access_token: access, refresh_token: refresh } = result;
        console.log("access token: "+result)

        // Store the tokens in localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        setMessage('Sign in successful!');
        navigate('/board')
      } else {
        const newErrors = {};
        if (result.username) newErrors.username = result.username[0];
        if (result.password) newErrors.password = result.password[0];

        setErrors(newErrors);
        setMessage(result.detail || 'Sign in failed');
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
        placeholder="Username or Email" 
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

