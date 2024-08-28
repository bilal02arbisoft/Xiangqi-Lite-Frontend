import React, { useEffect, useRef } from "react";
import "css/app.css";
import useState from "react-usestateref";
import axios from 'axios';
import Board from "components/Board/Board";
import BoardInfo from "components/BoardInfo/BoardInfo";
import { generateFEN, parseFENInput } from 'utils/FENUtils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { initializeSquares, findAvailableSqr, MovePiece } from 'utils/GameLogic';
import { useParams, useNavigate } from 'react-router-dom';

export const BoardContext = React.createContext();

function BoardPage() {
    const { game_id: gameIdFromParams } = useParams(); 
    const navigate = useNavigate();
    const usernameRef = useRef(null); 
    const ws = useRef(null);
    const gameIdRef = useRef(gameIdFromParams); 
    const [sqr, setSqr, latestSqr] = useState(initializeSquares);
    const [isFlipped, setIsFlipped, latestIsFlipped] = useState(false);
    const [selectedSquareInfo, setSelectedSquareInfo, latestSelectedSquareInfo] = useState();
    const [availableSqr, setAvailableSqr, latestAvailableSqr] = useState([]);
    const [counter, setCounter, latestCounter] = useState(0);
    const [currentTurn, setCurrentTurn, latestCurrentTurn] = useState("red");
    const [capturedPieceList, setCapturedPieceList, latestCapturedPieceList] = useState([]);
    const [FENOutput, setFENOutput, latestFENOutput] = useState("");
    const [error, setError] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [halfMoveClock, setHalfMoveClock] = useState(0);
    const [fullMoveNumber, setFullMoveNumber] = useState(1);
    const [sqrHistory, setSqrHistory] = useState([initializeSquares()]);

    useEffect(() => {
        async function fetchUserDetails() {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = response.data;
                usernameRef.current = userData.username;  
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError(true);
            }
        }

        async function connectToWebSocket() {
            const token = localStorage.getItem('access_token');
            if (ws.current && ws.current.readyState !== WebSocket.CLOSED ) {
                
                return;
            }
            ws.current = new WebSocket(`ws://localhost:8000/ws/game/?token=${token}`);
            ws.current.onopen = () => { 
                if (ws.current.readyState === WebSocket.OPEN && gameIdRef.current) {
                    ws.current.send(JSON.stringify({
                        type: 'game.join',
                        id: gameIdRef.current
                    }));
                }
            };
    
            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
    
                if (data.type === 'game.start') {
                    
                    if (usernameRef.current === data.black_player) {
                        handleFlipBoard();
                        setCurrentTurn(data.turn);

                    } else {
                        setCurrentTurn(data.turn);
                    }
                } else if (data.type === 'game.move') { 
                    if (data.fen && data.player !== latestCurrentTurn.current) {
                        handleParseFENInput(data.fen);
                        setCurrentTurn(data.player);
                    }
                } else if (data.type === 'error') {
                    console.error("Error received:", data.message);
                }
            };
    
            ws.current.onclose = () => {
                console.log("WebSocket connection closed");
                ws.current = null; 
            };
    
            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        }

        async function initializeGame() {
            await fetchUserDetails();
            try {
                const token = localStorage.getItem('access_token');
                if (gameIdFromParams) {
                    const response = await axios.get(`http://127.0.0.1:8000/game/detail/${gameIdFromParams}/`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const gameData = response.data;
                    setFENOutput(gameData.fen);
                    handleParseFENInput(gameData.fen);
                    gameIdRef.current = gameIdFromParams;  
                    connectToWebSocket();
                } else {
                    const response = await axios.post('http://127.0.0.1:8000/game/create/', null, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const gameData = response.data;
                    setFENOutput(gameData.initial_fen);
                    handleParseFENInput(gameData.initial_fen);
                    gameIdRef.current = gameData.game_id;  
                    navigate(`/game/${gameData.game_id}`);  
    
                    connectToWebSocket();
                }
            } catch (error) {
                setError(true);
            }
        }
        initializeGame();
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
        const isPlayerAllowedToMove = 
            (currentTurn === "red" && !isFlipped) || 
            (currentTurn === "black" && isFlipped);

        if (!isPlayerAllowedToMove) {
            return;
        }

        setSqrHistory((prevHistory) => [...prevHistory, latestSqr.current]);

        const move = MovePiece(
            piece,
            color,
            row,
            column,
            latestCounter.current,
            latestCurrentTurn.current,
            latestSqr.current,
            latestAvailableSqr.current,
            latestSelectedSquareInfo.current,
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
            setSelectedSquareInfo
        );
        handleGenerateFEN();

        if (move && ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({
                type: 'game.move',
                fen: latestFENOutput.current,
                player: latestCurrentTurn.current
            });
            ws.current.send(message);
        }
    }

    function handleFlipBoard() {
        setIsFlipped(true);
        setSqr((prevState) => {
            const flippedBoard = [...prevState].reverse();
            return flippedBoard;
        });
    }

    function handleGenerateFEN() {
        generateFEN(setFENOutput, latestSqr.current, isFlipped, currentTurn);
    }

    function handleParseFENInput(FEN) {
        parseFENInput(FEN, setSqr, latestIsFlipped.current, setCurrentTurn, setCounter);
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
                        {/* <BoardInfo /> */}
                    </div>
                </div>
            </BoardContext.Provider>
        </DndProvider>
    );
}

export default BoardPage;
