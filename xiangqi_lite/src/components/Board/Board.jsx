import React from "react";
import Square from "components/Square";

export default function Board(props) {
  const { squares } = props;
  return (
    <div className="board">
      <Square squares={squares} />
    </div>
  );
}
