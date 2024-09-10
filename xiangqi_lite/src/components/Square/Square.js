import React from "react";

import SquareItem from "components/SquareItem";

const Square = (props) => {
  const { squares } = props;
  return (
    <>
      {squares.map((square) => (
        <SquareItem key={square.id} square={square} />
      ))}
    </>
  );
}
export default Square
