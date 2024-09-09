import React from "react";

import SquareItem from "components/Board/SquareItem";

const Square = ({ squares }) => {
  return (
    <>
      {squares.map((square) => (
        <SquareItem key={square.id} square={square} />
      ))}
    </>
  );
}
export default Square
