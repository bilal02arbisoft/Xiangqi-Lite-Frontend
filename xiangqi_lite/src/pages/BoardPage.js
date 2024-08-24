import React from "react";
import { useEffect } from "react";
import "../css/app.css";
import useState from "react-usestateref";
import Board from "../components/Board/Board";
import BoardInfo from "../components/BoardInfo/BoardInfo";
import { generateFEN, parseFENInput } from '../utils/FENUtils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { initializeSquares, findAvailableSqr, MovePiece } from '../utils/GameLogic';

export const BoardContext = React.createContext();

function BoardPage() {
    const initFEN =
        "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR b";

    const [sqr, setSqr, latestSqr] = useState(initializeSquares);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedSquareInfo, setSelectedSquareInfo, latestselectedSquareInfo] = useState(null);
    const [availableSqr, setAvailableSqr, latestAvailableSqr] = useState([]);
    const [counter, setCounter, latestCounter] = useState(0);
    const [currentTurn, setCurrentTurn, latestCurrentTurn] = useState("black");
    const [capturedPieceList, setCapturedPieceList, latestCapturedPieceList] = useState([]);
    const [FENOutput, setFENOutput] = useState(initFEN);
    const [error, setError] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [halfMoveClock, setHalfMoveClock] = useState(0);
    const [fullMoveNumber, setFullMoveNumber] = useState(1);
    const [sqrHistory, setSqrHistory] = useState([initializeSquares()]);

    useEffect(() => {
        handleInit();
    }, []);

    function addAvailableStyle() {
        const newSqr = [...sqr];
        for (const s of newSqr) {
            s.isAvailable = false;
            if (latestAvailableSqr.current.some((sqr) => sqr.id === s.id)) {
                s.isAvailable = true;
            }
        }
        setSqr(newSqr);
    }

    function handleSelectSquare(row, column) {
        const newSqr = [...sqr];
        const index = newSqr.findIndex((s) => s.id === `${row}-${column}`);
        for (const s of newSqr) {
            s.isSelected = false;
        }
        newSqr[index].isSelected = true;
        setSelectedSquareInfo((prevState) => ({ ...prevState, ...newSqr[index] }));
        setCounter(1);
        setSqr(newSqr);
    }

    function handleClearBoard() {

        setCounter(0);
        setSqr((prevState) => {
            const newBoard = [...prevState];
            newBoard.forEach((sqr) => {
                sqr.piece = null;
                sqr.color = null;
            });
            return newBoard;
        });
    }

    function handleMovePiece(piece, color, row, column) {
        setSqrHistory((prevHistory) => [...prevHistory, latestSqr.current]);
        MovePiece(
            piece,
            color,
            row,
            column,
            latestCounter.current,
            latestCurrentTurn.current,
            latestSqr.current,
            latestAvailableSqr.current,
            latestselectedSquareInfo.current,
            handleSelectSquare,
            findAvailableSqr,
            setAvailableSqr,
            addAvailableStyle,
            setHalfMoveClock,
            setCapturedPieceList,
            setSqr,
            setCurrentTurn,
            setFullMoveNumber,
            setCounter,
            setSelectedSquareInfo,
        );
    }

    function handleFlipBoard() {
        setIsFlipped(true);
        setSqr((prevState) => {
            const flippedBoard = [...prevState].reverse();
            return flippedBoard;
        });
    }

    function handleInit() {
        handleClearBoard();
        setCapturedPieceList([]);
        handleParseFENInput(initFEN);
    }

    function handleGenerateFEN() {
        generateFEN(setFENOutput, latestSqr.current, isFlipped, currentTurn);
    }

    function handleParseFENInput(FEN) {
        parseFENInput(FEN, setSqr, isFlipped, setCurrentTurn, setCounter);
    }

    function handleOpenErrorModal() {
        setError(true);
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <BoardContext.Provider
                value={{
                    handleMovePiece,
                    latestCapturedPieceList,
                    latestAvailableSqr,
                    setAvailableSqr,
                    sqr,
                    selectedSquareInfo,
                    setCounter,
                    currentTurn,
                    setCurrentTurn,
                    setSqr,
                    setSelectedSquareInfo,
                    setCapturedPieceList,
                    setHalfMoveClock,
                    setFullMoveNumber,
                    addAvailableStyle,
                    handleGenerateFEN,
                    FENOutput,
                    handleParseFENInput,
                    handleOpenErrorModal,
                    findAvailableSqr,
                    handleSelectSquare,
                }}
            >
                <div>
                    <div className={`app__container ${error ? "disabled" : ""}`}>
                        <Board squares={sqr} />
                        <BoardInfo />
                    </div>
                </div>
            </BoardContext.Provider>
        </DndProvider>
    );
}

export default BoardPage;
