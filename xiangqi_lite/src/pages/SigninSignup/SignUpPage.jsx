import React from 'react';

import SignInSignUpTabs from 'pages/SigninSignup/Components/SignInSignUpTabs';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[url('https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/light-bg.svg')] bg-cover bg-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-center mb-4 items-end">
          <img
            src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/logo-icon.svg"
            alt="Xiangqi.com"
            className="h-12"
          />
          <img
            src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/xiangqi-text-red.svg"
            alt="Xiangqi.com"
            className="h-6 ml-2 mb-3"
          />
        </div>
        <SignInSignUpTabs />
      </div>
    </div>
  );
}

export default SignUpPage;

