import React from 'react';

function MoveHistory({ moveHistory }) {
  
  const chunkMoves = (moves) => {
    const chunks = [];
    for (let i = 0; i < moves.length; i += 2) {
      chunks.push([moves[i], moves[i + 1] ? moves[i + 1] : "—"]);
    }
    return chunks;
  };

  const pairedMoves = chunkMoves(moveHistory);

  return (
    <div className="move-history-container">
      
      <table>
         <thead>
          
        </thead> 
        <tbody>
          {pairedMoves.map((movePair, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{movePair[0]}</td>
              <td>{movePair[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MoveHistory;
