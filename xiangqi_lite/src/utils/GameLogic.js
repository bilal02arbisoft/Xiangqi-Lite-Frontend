import {
    pawn,
    advisor,
    bishop,
    king,
    rook,
    cannon,
    knight,
    checkDanger,
  } from "./pieceLogic"

  
export function findAvailableSqr(sqr,piece, color, row, column) {
    // console.log('findAvailableSqr params:', { sqr, piece, color, row, column });
    const newSqr = [...sqr];
    const targetSqr = [];
    const selectSqrById = (id) => newSqr.find((s) => s.id === id);
    const generateTargetSqr = (ary) => {
    
      for (const sq of ary) {
        const target = selectSqrById(sq);
        if (target) {
          if (target.color && target.color !== color) {
            target.isCapture = true;
          }
          targetSqr.push(target);
        }
      }
    };
  
    switch (piece) {
      case "pawn":
        generateTargetSqr(pawn(color, row, column));
        break;
      case "advisor":
        generateTargetSqr(advisor(color, row, column));
        break;
      case "bishop":
        generateTargetSqr(bishop([...sqr], color, row, column));
        break;
      case "king":
        generateTargetSqr(king(color, row, column));
        break;
      case "rook":
        generateTargetSqr(rook([...sqr], row, column));
        break;
      case "cannon":
        generateTargetSqr(cannon([...sqr], color, row, column));
        break;
      case "knight":
        generateTargetSqr(knight([...sqr], row, column));
        break;
      default:
        
        return [];
    }
  
    const newTargetSqr = targetSqr.filter((s) => s.color !== color);
  
    const validatedTargetSqr = [];
    for (const target of newTargetSqr) {
      const simulateSqr = [...sqr];
      const originalIndex = simulateSqr.findIndex(
        (s) => s.id === `${row}-${column}`
      );
      console.log('target',row);
      const destinationIndex = simulateSqr.findIndex(
        (s) => s.id === `${target.row}-${target.column}`
      );
  
      simulateSqr[originalIndex] = {
        ...simulateSqr[originalIndex],
        piece: null,
        color: null,
      };
      simulateSqr[destinationIndex] = {
        ...simulateSqr[destinationIndex],
        piece: piece,
        color: color,
      };
      console.log("ValidatedTarget:",validatedTargetSqr)
      console.log("Target:",targetSqr)
      
  
      const kingSqr = simulateSqr.find(
        
        (s) => s.piece === "king" && s.color === color
      );
  
      
      if (
        
        checkDanger(simulateSqr, color, kingSqr.row, kingSqr.column) === undefined
      ) {
        
        validatedTargetSqr.push(target);
      }
    }
    
    return validatedTargetSqr;
  }

  export const initializeSquares = () => {
    const row = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const column = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const squares = [];
  
    row.forEach((r) => {
      column.forEach((c) => {
        squares.push({
          id: `${r}-${c}`,
          piece: null,
          color: null,
          row: r,
          column: c,
          isAvailable: false,
          isPreviousMoved: false,
          isJustMoved: false,
          isSelected: false,
        });
      });
    });
  
    return squares;
  };  
  

  export function MovePiece(
    piece,
    color,
    row,
    column,
    counter,
    currentTurn,
    sqr,
    availableSqr,
    selectedSquareInfo,
    handleSelectSquare,
    findAvailableSqr,
    setAvailableSqr,
    addAvailableStyle,
    setHalfMoveClock,
    setCapturedPieceList,
    setSqr,
    setCurrentTurn,
    setFullMoveNumber,
    checkGameOver,
    setCounter,
    setSelectedSquareInfo
) {
    console.log('MovePiece called with:', { piece, color, row, column, counter, currentTurn });

    if (counter % 2 === 0) {
        // This block runs when it's time to select a piece to move
        if (color === currentTurn) {
            handleSelectSquare(row, column);
            const avail = findAvailableSqr(sqr, piece, color, row, column);
            console.log("Available moves:", avail);
            setAvailableSqr(avail);
            addAvailableStyle();
        } else {
            return false;
        }
    }
     else if (counter % 2 !== 0) {
        // This block runs when a piece is selected and a move is being made
        if (color === currentTurn) {
            handleSelectSquare(row, column);
            setAvailableSqr(findAvailableSqr(sqr, piece, color, row, column));
            addAvailableStyle();
            return false;
        }
         else if (availableSqr.some((sqr) => sqr.id === `${row}-${column}`)) {
            console.log("Moving piece...");

            if (color !== null) {
                setHalfMoveClock(0);
                setCapturedPieceList((prevState) => [
                    ...prevState,
                    sqr.find((s) => s.id === `${row}-${column}`),
                ]);
            } else if (piece === "pawn") {
                setHalfMoveClock(0);
            } else {
                setHalfMoveClock((prev) => prev + 1);
            }

            // Update the board state
            setSqr((prevState) => {
                const newSqr = prevState.map((s) => ({ ...s }));

                const startIndex = newSqr.findIndex(
                    (s) => s.id === `${selectedSquareInfo.row}-${selectedSquareInfo.column}`
                );
                const destinationIndex = newSqr.findIndex(
                    (s) => s.id === `${row}-${column}`
                );

                // Update the state of all squares
                newSqr.forEach((s, index) => {
                    newSqr[index] = {
                        ...s,
                        isJustMoved: false,
                        isPreviousMoved: false,
                        isAvailable: false,
                    };
                });

                // Update the start square
                newSqr[startIndex] = {
                    ...newSqr[startIndex],
                    piece: null,
                    color: null,
                    isPreviousMoved: true,
                };

                // Update the destination square
                newSqr[destinationIndex] = {
                    ...newSqr[destinationIndex],
                    piece: selectedSquareInfo.piece,
                    color: selectedSquareInfo.color,
                    isJustMoved: true,
                };

                console.log('Board state after move:', newSqr);

                return newSqr;
            });
            console.log("Current turn in move",currentTurn)
            // Update the turn and move number
            if (currentTurn === "red") {
                setCurrentTurn("black");
            } else {
                setCurrentTurn("red");
                setFullMoveNumber((prev) => prev + 1);
            }

            // Check if the game is over
            checkGameOver();

            // Reset the counter for the next move
            setCounter(2);

            return true;
        } 
        else if (!availableSqr.some((sqr) => sqr.id === `${row}-${column}`)) {
           
            console.log('Move is not valid, resetting available squares');
            const newSqr = [...sqr];
            for (const s of newSqr) {
                s.isAvailable = false;
                s.isSelected = false;
            }
            setSqr(newSqr);
            setAvailableSqr([]);
            return false;
        }
    }

    return false;
}


 
export function checkGameOver(sqr, currentTurn, findAvailableSqr, setGameOver) {
    const pieceList = sqr.filter(
      (p) => p.color === currentTurn && p.piece != null
    );
    console.log(pieceList);
    const possibleMoveList = [];
    for (const piece of pieceList) {
      const moveList = findAvailableSqr(
        sqr,
        piece.piece,
        piece.color,
        piece.row,
        piece.column
      );
      if (moveList.length !== 0) {
        possibleMoveList.push(...moveList);
      }
    }
    console.log(possibleMoveList, possibleMoveList.length);
    if (possibleMoveList.length === 0) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }
   
  
