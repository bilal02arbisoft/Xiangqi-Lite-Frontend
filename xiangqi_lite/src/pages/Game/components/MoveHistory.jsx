import React, { useState, useContext, useEffect } from 'react';

import { BoardContext } from 'pages/Game/BoardPage';

function MoveHistory({ moveHistory }) {
  const { handleParseFENInput, fenHistory, isPlayerAllowedToMove } =
    useContext(BoardContext);
  const [currentIndex, setCurrentIndex] = useState(fenHistory.length - 1);
  const [showTotalMoves, setShowTotalMoves] = useState(true);

  const chunkMoves = (moves) => {
    const chunks = [];
    for (let i = 0; i < moves.length; i += 2) {
      chunks.push([moves[i], moves[i + 1] ? moves[i + 1] : "—"]);
    }
    return chunks;
  };

  const pairedMoves = chunkMoves(moveHistory);
  const totalMoves = moveHistory.length;

  useEffect(() => {
    if (fenHistory.length > 0) {
      setCurrentIndex(fenHistory.length - 1);
    }
  }, [fenHistory]);

  const goToFirstMove = () => {
    if (fenHistory.length > 0) {
      setCurrentIndex(0);
      handleParseFENInput(fenHistory[0]);
      setShowTotalMoves(false);
    }
  };

  const goToPreviousMove = () => {
    if (currentIndex > 0 && fenHistory.length > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      handleParseFENInput(fenHistory[newIndex]);
      setShowTotalMoves(false);
    }
  };

  const goToNextMove = () => {
    if (currentIndex < fenHistory.length - 1 && fenHistory.length > 0) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      handleParseFENInput(fenHistory[newIndex]);
      setShowTotalMoves(false);
    }
  };

  const goToLastMove = () => {
    if (fenHistory.length > 0) {
      const lastIndex = fenHistory.length - 1;
      setCurrentIndex(lastIndex);
      handleParseFENInput(fenHistory[lastIndex]);
      setShowTotalMoves(false);
    }
  };

  const playerAllowedToMove = isPlayerAllowedToMove();

  return (
    <div
      className="move-history-container"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <ul
        className="moves-navigator"
        style={{ flexGrow: 1, overflowY: "auto" }}
      >
        {pairedMoves.map((movePair, index) => (
          <li key={index} className="move-item">
            <p className="move-index">{index + 1}</p>
            <p
              className={`move red-move ${currentIndex === index * 2 ? "highlight" : ""}`}
            >
              <span>{movePair[0].toUpperCase()}</span>
            </p>
            <p
              className={`move black-move ${currentIndex === index * 2 + 1 ? "highlight" : ""}`}
            >
              <span>{movePair[1].toUpperCase()}</span>
            </p>
          </li>
        ))}
      </ul>
      <div
        className="history-controls"
        style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}
      >
        <button
          onClick={goToFirstMove}
          className="control-button"
          title="First Move"
          disabled={
            playerAllowedToMove || currentIndex === 0 || fenHistory.length === 0
          }
        >
          |&lt;
        </button>
        <button
          onClick={goToPreviousMove}
          className="control-button"
          title="Previous Move"
          disabled={
            playerAllowedToMove || currentIndex === 0 || fenHistory.length === 0
          }
        >
          &lt;
        </button>
        <span className="page-number">
          {showTotalMoves ? totalMoves : currentIndex + 1}
        </span>
        <button
          onClick={goToNextMove}
          className="control-button"
          title="Next Move"
          disabled={
            playerAllowedToMove ||
            currentIndex >= fenHistory.length - 1 ||
            fenHistory.length === 0
          }
        >
          &gt;
        </button>
        <button
          onClick={goToLastMove}
          className="control-button"
          title="Last Move"
          disabled={
            playerAllowedToMove ||
            currentIndex === fenHistory.length - 1 ||
            fenHistory.length === 0
          }
        >
          &gt;|
        </button>
      </div>
    </div>
  );
}

export default MoveHistory;
