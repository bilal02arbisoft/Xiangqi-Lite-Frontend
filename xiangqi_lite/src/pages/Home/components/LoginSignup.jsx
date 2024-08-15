import React, { useState } from 'react';

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section id="login-signup" className="py-16">
      <div className="max-w-md mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <button onClick={() => setIsLogin(true)} className={`py-2 px-4 ${isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`py-2 px-4 ${!isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg`}>
            Signup
          </button>
        </div>
        {isLogin ? (
          <form className="space-y-4">
            <input type="text" placeholder="Username or Email" className="w-full p-2 border rounded" required />
            <input type="password" placeholder="Password" className="w-full p-2 border rounded" required />
            <a href="#" className="text-sm text-gray-500">Forgot Password?</a>
            <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Login</button>
          </form>
        ) : (
          <form className="space-y-4">
            <input type="text" placeholder="Username" className="w-full p-2 border rounded" required />
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" required />
            <input type="password" placeholder="Password" className="w-full p-2 border rounded" required />
            <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded" required />
            <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Sign Up</button>
          </form>
        )}
      </div>
    </section>
  );
}

export default LoginSignup;
