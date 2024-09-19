// MoveHistory.js

import React, { useState, useContext, useEffect } from 'react';
import { BoardContext } from 'pages/Game'; 

const MoveHistory = () => {
    const { 
        history, 
        currentIndex, 
        setCurrentIndex, 
        isGameReady,
        handleParseFENInput, 
        setRedTimeRemaining, 
        setBlackTimeRemaining, 
        setRedMoveTimeRemaining, 
        setBlackMoveTimeRemaining 
    } = useContext(BoardContext);

    const [showTotalMoves, setShowTotalMoves] = useState(true); 

    const chunkMoves = (moves) => {
        const chunks = [];
        for (let i = 0; i < moves.length; i += 2) {
            chunks.push([moves[i], moves[i + 1] ? moves[i + 1] : "—"]);
        }
        return chunks;
    };

    const pairedMoves = chunkMoves(history.map(entry => entry.move));
    const totalMoves = history.length; 

    useEffect(() => {
        if (history.length > 0) {
            setCurrentIndex(history.length - 1);
        }
    }, [history, setCurrentIndex]);


    const navigateToMove = (index) => {
        if (index < 0 || index >= history.length) return;
        setCurrentIndex(index);
        const moveData = history[index];
        handleParseFENInput(moveData.fen);

        if (!isGameReady) {
          
            if (moveData.player === 'red') {
                setRedTimeRemaining(moveData.remainingTimeRed);
                setRedMoveTimeRemaining(60-moveData.moveTime);
                setBlackMoveTimeRemaining(60); 
            } else {
              setBlackTimeRemaining(moveData.remainingTimeBlack);
              setBlackMoveTimeRemaining(60-moveData.moveTime);
              setRedMoveTimeRemaining(60); 
            }
        }

        setShowTotalMoves(false); 
    };

    const goToFirstMove = () => {
        if (history.length > 0) {
            navigateToMove(0);
        }
    };

    const goToPreviousMove = () => {
        if (currentIndex > 0 && history.length > 0) {
            navigateToMove(currentIndex - 1);
        }
    };

    const goToNextMove = () => {
        if (currentIndex < history.length - 1 && history.length > 0) {
            navigateToMove(currentIndex + 1);
        }
    };

    const goToLastMove = () => {
        if (history.length > 0) {
            navigateToMove(history.length - 1);
        }
    };

    return (
        <div className="move-history-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ul className="moves-navigator" style={{ flexGrow: 1, overflowY: 'auto' }}>
                {pairedMoves.map((movePair, index) => (
                    <li key={index} className="move-item">
                        <p className="move-index">{index + 1}</p>
                        <p className={`move red-move ${currentIndex === index * 2 ? 'highlight' : ''}`}>
                            <span>{movePair[0].toUpperCase()}</span>
                        </p>
                        <p className={`move black-move ${currentIndex === index * 2 + 1 ? 'highlight' : ''}`}>
                            <span>{movePair[1].toUpperCase()}</span>
                        </p>
                    </li>
                ))}
            </ul>
            <div className="history-controls" style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                <button
                    onClick={goToFirstMove}
                    className="control-button"
                    title="First Move"
                    disabled={ currentIndex === 0 || history.length === 0}
                >
                    |&lt;
                </button>
                <button
                    onClick={goToPreviousMove}
                    className="control-button"
                    title="Previous Move"
                    disabled={ currentIndex === 0 || history.length === 0}
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
                    disabled={ currentIndex >= history.length - 1 || history.length === 0}
                >
                    &gt;
                </button>
                <button
                    onClick={goToLastMove}
                    className="control-button"
                    title="Last Move"
                    disabled={ currentIndex === history.length - 1 || history.length === 0}
                >
                    &gt;|
                </button>
            </div>
        </div>
    );
}

export default MoveHistory;
