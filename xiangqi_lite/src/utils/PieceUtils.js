export const identifyPiece = (letter) => {
  switch (letter.toUpperCase()) {
    case "K":
      return "king";
    case "R":
      return "rook";
    case "N":
      return "knight";
    case "C":
      return "cannon";
    case "A":
      return "advisor";
    case "B":
      return "bishop";
    case "P":
      return "pawn";
    default:
      return null;
  }
};

export const identifyColor = (letter) => {
  if (parseInt(letter) === 1) {
    return null;
  } else if (letter === letter.toUpperCase()) {
    return "red";
  } else {
    return "black";
  }
};
