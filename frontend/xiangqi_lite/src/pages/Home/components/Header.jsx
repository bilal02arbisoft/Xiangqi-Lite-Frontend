import React from 'react';

function Header() {
  return (
    <header className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <div className="text-2xl font-bold">Xiangqi Online</div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#home" className="hover:text-orange-400">Home</a></li>
          <li><a href="#about" className="hover:text-orange-400">About Xiangqi</a></li>
          <li><a href="#login-signup" className="hover:text-orange-400">Login</a></li>
          <li><a href="#login-signup" className="hover:text-orange-400">Signup</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
