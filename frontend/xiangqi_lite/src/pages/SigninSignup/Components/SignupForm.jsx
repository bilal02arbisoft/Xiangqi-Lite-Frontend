import React from 'react';
import InputField from '../../../components/InputField';
import SelectField from '../../../components/SelectField';
import Button from '../../../components/Button';

function SignUpForm() {
  return (
    <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <InputField label="Username" placeholder="Username" name="username" />
      <InputField label="Email" placeholder="Email" name="email" type="email" />
      <InputField label="Password" placeholder="Password" name="password" type="password" />
      <SelectField 
        label="Country/Region" 
        name="country" 
        options={[
          { value: 'us', label: 'United States' },
          { value: 'cn', label: 'China' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'pk', label: 'Pakistan' },
          

        ]}
      />
      <SelectField 
        label="Skill level" 
        name="skill" 
        options={[
          { value: 'newbie', label: 'Xiagnqi Newbie' },  
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ]}
      />
      <Button>Sign Up</Button>
    </form>
  );
}
export default SignUpForm;
