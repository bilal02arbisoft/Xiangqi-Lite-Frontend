import React from 'react';


function Hero() {
  return (
    <section 
      className="bg-red-500 text-white text-center py-32"
    >
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to Xiangqi Online</h1>
        <p className="text-xl mb-8">Experience the ancient strategy game of Chinese chess</p>
        <div className="flex justify-center space-x-4">
          <a href="#login-signup" className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-orange-600">Play Now</a>
          <a href="#about" className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-800">Learn More</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
