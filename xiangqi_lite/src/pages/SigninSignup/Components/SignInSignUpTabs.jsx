import React, { useState } from 'react';
import SignUpForm from './SignupForm';
import SignInForm from './SigninForm';

function SignInSignUpTabs() {
  const [activeTab, setActiveTab] = useState('SignUp');

  return (
    <div>
      <div className="flex justify-center mb-8">
        <button 
          onClick={() => setActiveTab('SignIn')} 
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'SignIn' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
        >
          Sign In
        </button>
        <button 
          onClick={() => setActiveTab('SignUp')} 
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'SignUp' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
        >
          Sign Up
        </button>
      </div>
      
      {activeTab === 'SignIn' ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}
export default SignInSignUpTabs;
