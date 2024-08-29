import { identifyPiece, identifyColor } from "utils/PieceUtils";

export const parseFENInput = (
    FEN,
    setSqr,
    isFlipped,
    setCurrentTurn,
    setCounter
  ) => {
    const splitUpFEN = FEN.trim().split(" ");
    const boardFEN = splitUpFEN[0].split("/");
    const turnOrder = splitUpFEN[1]; 
  
    const decodedFEN = boardFEN.map((FENstring) => {
      return FENstring.replace(/9/g, "111111111")
        .replace(/8/g, "11111111")
        .replace(/7/g, "1111111")
        .replace(/6/g, "111111")
        .replace(/5/g, "11111")
        .replace(/4/g, "1111")
        .replace(/3/g, "111")
        .replace(/2/g, "11")
        .split("");
    });
  
    const newSqr = [];
    decodedFEN.forEach((FENstring, FENStringIndex) => {
      FENstring.forEach((FENletter, letterIndex) => {
        const sqrFromFEN = {
          id: `${10 - FENStringIndex}-${letterIndex + 1}`,
          piece: identifyPiece(FENletter),
          color: identifyColor(FENletter),
          row: 10 - FENStringIndex,
          column: letterIndex + 1,
          isAvailable: false,
          isPreviousMoved: false,
          isJustMoved: false,
          isSelected: false,
        };
        newSqr.push(sqrFromFEN);
      });
    });
  
    isFlipped ? setSqr(newSqr.reverse()) : setSqr(newSqr);
    
   
    setCounter(0);
  };
  
export const generateFEN = (setFENOutput, squares, isFlipped, currentTurn) => {
  const newSqr = isFlipped ? [...squares].reverse() : [...squares];
  const rows = {};
  for (let i = 10; i >= 1; i--) {
    rows[`row${i}`] = newSqr.filter((sqr) => sqr.row === i);
  }
  const rowFEN = [];
  for (const row in rows) {
    rowFEN.push(produceFENString(rows[row]));
  }
  const FENQuery = [];
  for (const row of rowFEN) {
    FENQuery.push(row.join(""));
  }
  const turnOrder = currentTurn == "red" ? "r" : "b";
  setFENOutput(`${FENQuery.join("/")} ${turnOrder}`);

};

const produceFENString = (ary) => {
  let FENQuery = [];
  ary.forEach((sqr) => {
    if (sqr.piece === null) {
      if (typeof FENQuery[FENQuery.length - 1] === "number") {
        FENQuery[FENQuery.length - 1] += 1;
      } else {
        FENQuery.push(1);
      }
    } else {
      let letter;
      if (sqr.piece === "knight") {
        letter = "n";
      } else if (sqr.piece!=null) {
        letter = sqr.piece.split("")[0];
      }
      FENQuery.push(sqr.color === "red" ? letter.toUpperCase() : letter);
    }
  });
  return FENQuery;
};
