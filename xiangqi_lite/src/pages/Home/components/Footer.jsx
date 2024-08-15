import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6">
      <ul className="flex justify-center space-x-4 mb-4">
        <li><a href="#home" className="hover:text-orange-400">Home</a></li>
        <li><a href="#about" className="hover:text-orange-400">About</a></li>
        <li><a href="#terms" className="hover:text-orange-400">Terms of Service</a></li>
        <li><a href="#privacy" className="hover:text-orange-400">Privacy Policy</a></li>
        <li><a href="#contact" className="hover:text-orange-400">Contact Us</a></li>
      </ul>
      <p>© 2024 Xiangqi Online. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
