import React from "react";
import SquareItem from "./SquareItem";

export default function Square({ squares }) {
  return (
    <>
      {squares.map((square) => (
        <SquareItem key={square.id} square={square} />
      ))}
    </>
  );
}
