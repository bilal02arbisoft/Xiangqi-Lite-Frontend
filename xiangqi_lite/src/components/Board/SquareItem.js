import React, { useContext } from "react";
import { useDrop } from 'react-dnd';
import { BoardContext } from "../../pages/BoardPage";
import Piece from "./Piece";

class ErrorBoundary extends React.Component {
  constructor(props) {
      super(props);
      this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
      return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
      console.error("Error occurred:", error, errorInfo);
  }

  render() {
      if (this.state.hasError) {
          return <h1>Something went wrong.</h1>;
      }

      return this.props.children;
  }
}

export default function SquareItem({ square }) {
  const { handleMovePiece } = useContext(BoardContext);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PIECE",
    drop: (item) => {
      console.log('Dropped item:', item);
      handleMovePiece(square.piece, square.color, square.row, square.column);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  

  const handleClick = () => {
    handleMovePiece(square.piece, square.color, square.row, square.column);
  };

  return (
    <ErrorBoundary>
    <div
      ref={drop}
      className={`square ${square.isAvailable ? "square__available" : ""} 
        ${square.isSelected || square.isJustMoved || square.isPreviousMoved ? "square__selected" : ""}
        ${isOver ? "square__highlight" : ""}`}
      data-row={square.row}
      data-column={square.column}
      onClick={handleClick}
    >
      {square.piece !== null && (
        <Piece
          pieceInfo={{ ...square, id: square.pieceId }}
          square={square}
        />
      )}
    </div>
    </ErrorBoundary>
  );
}
