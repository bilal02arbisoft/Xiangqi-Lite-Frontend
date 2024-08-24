import React from "react";
import FENGenerator from "./FENGenerator";
import CapturedPiece from "./CapturedPiece"
export default function BoardInfo() {
  return (
    <div className="board-info">
      <div className="FEN-generator__container">
        <FENGenerator />
        <CapturedPiece/> 
      </div>
    </div>
  );
}
