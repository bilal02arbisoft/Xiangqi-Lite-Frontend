import React, {useContext} from 'react'
import Piece from '../Board/Piece'
import { BoardContext }  from "../../pages/BoardPage";
import {v4 as uuidv4} from 'uuid'
export default function CapturedPiece({color}) {
  const {latestCapturedPieceList} = useContext(BoardContext);
  const newCapturedPieceList = [...latestCapturedPieceList.current].map(p => ({...p, id:uuidv4()}));
  console.log("capture",latestCapturedPieceList.current)
  const filteredList = newCapturedPieceList.filter(p => p.color === color );
  filteredList.sort((a,b) => {
    const pieceA = a.piece;
    const pieceB = b.piece;
    return (pieceA > pieceB ? -1 : 1)
  })
  return (
    <div className='captured-piece-list__container'>
      
      {filteredList.map(p => (
        <Piece pieceInfo={p} key={p.id}/>
      ))}
    </div>
  )
}
