import React from "react";
import { useDrag } from 'react-dnd';


export default function Piece({ pieceInfo, square }) {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "PIECE",
    item: () => {
     
      return {
        piece: pieceInfo.piece,
        color: pieceInfo.color,
        row: pieceInfo.row,
        column: pieceInfo.column,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const backgroundColor = pieceInfo.color === "red" ? "rgb(222, 34, 24)" : "rgb(0, 0, 0)";
  return (
    <div
      className="piece"
      ref={drag}  
      style={{
        backgroundColor: backgroundColor,
        opacity: isDragging ? 0.5 : 1,  
      }}
    >
      <img
        src={require(`../../images/${pieceInfo.color}_${pieceInfo.piece}.svg`)}
        alt={`${pieceInfo.color}_${pieceInfo.piece}`}
        style={{
          width: "60%",  
          height: "60%",
          borderRadius: "20%",
          margin: "20%", 
        }}
      />
    </div>
  );
}
