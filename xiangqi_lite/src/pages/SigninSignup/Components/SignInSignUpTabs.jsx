import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SignUpForm from 'pages/SigninSignup/Components/SignupForm';
import SignInForm from 'pages/SigninSignup/Components/SigninForm';

function SignInSignUpTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.includes('signup') ? ' SignUp' : 'SignIn';

  return (
    <div>
      <div className="flex justify-center mb-8">
        <button 
          onClick={() => navigate('/auth/login')} 
          className={`px-4 py-2 text-lg font-semibold ${activeTab === 'SignIn' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
        >
          Sign In
        </button>
        <button 
          onClick={() => navigate('/auth/signup')} 
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
