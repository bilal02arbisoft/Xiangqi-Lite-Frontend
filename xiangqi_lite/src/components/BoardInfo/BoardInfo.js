import React from "react";
import FENGenerator from "components/BoardInfo/FENGenerator";
export default function BoardInfo() {
  return (
    <div className="board-info">
      <div className="FEN-generator__container">
        <FENGenerator /> 
      </div>
    </div>
  );
}
