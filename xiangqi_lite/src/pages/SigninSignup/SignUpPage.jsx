import React from 'react';
import SignInSignUpTabs from './Components/SignInSignUpTabs';

function SignUpPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-red-400">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-center mb-4">
          <img src="/xiangqi_hero.jpg" alt="Xiangqi.com" className="h-8" />
        </div>
        <SignInSignUpTabs />
      </div>
    </div>
  );
}

export default SignUpPage;
