import React from 'react';

function About() {
  return (
    <section id="about" className=" bg-red-500 text-white py-16 text-center">
      <h2 className="text-3xl font-bold mb-6">About Xiangqi</h2>
      <p className="text-lg max-w-2xl mx-auto mb-8">
        Xiangqi, also known as Chinese chess, is one of the most popular board games in China and among Chinese communities around the world. It is a game of skill, strategy, and careful planning, offering endless possibilities for creative and strategic play.
      </p>
      {/* <img src="xiangqi-board.jpg" alt="Xiangqi Board" className="mx-auto max-w-full h-auto rounded shadow-md" /> */}
    </section>
  );
}

export default About;
