import React, { useState } from 'react';
import InputField from 'components/InputField';
import SelectField from 'components/SelectField';
import Button from 'components/Button';

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    skill_level: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.country) newErrors.country = 'Country/Region is required';
    if (!formData.skill_level) newErrors.skill_level = 'Skill level is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
        
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        skill_level: formData.skill_level,
        profile: {
          country: formData.country,
        },
      };

      console.log('Data to be sent:', dataToSend);

      const response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('Server response:', result); 


      if (response.ok) {
        setMessage('Sign up successful!');
        setFormData({
          username: '',
          email: '',
          password: '',
          country: '',
          skill_level: '',
        }); 
        setErrors({}); 
      } else {
        
        const newErrors = {};
        if (result.username) newErrors.username = result.username[0];
        if (result.email)    newErrors.email = result.email[0];
        if (result.password)    newErrors.password= result.password[0];
        if (result.profile && result.profile.skill_level) {
          newErrors.skill_level = result.profile.skill_level[0];
        }
        setErrors(newErrors);
        setMessage(result.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Error occurred during signup:', error); 
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
        label="Email"
        placeholder="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
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
      <SelectField
        label="Country/Region"
        name="country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'cn', label: 'China' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'pk', label: 'Pakistan' },
        ]}
        value={formData.country}
        onChange={handleChange}
        error={errors.country}
      />
      <SelectField
        label="Skill level"
        name="skill_level"
        options={[
          { value: 'newbie', label: 'Xiangqi Newbie' },
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ]}
        value={formData.skill_level}
        onChange={handleChange}
        error={errors.skill_level}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </Button>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </form>
  );
}
export default SignUpForm;
