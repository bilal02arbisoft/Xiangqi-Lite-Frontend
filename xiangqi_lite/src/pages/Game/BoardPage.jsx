import React, { useEffect, useRef } from "react";
import "css/boardpage.css";
import useState from "react-usestateref";
import axios from 'axios';
import Board from "components/Board/Board";
import { generateFEN, parseFENInput } from 'utils/FENUtils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { initializeSquares, findAvailableSqr, MovePiece } from 'utils/GameLogic';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameTimer } from 'pages/Game/Timer';
import { handleWebSocketOpen, handleWebSocketMessage } from 'pages/Game/WebsocketHandler'; 
import WebSocketManager from  'utils/useWebSocket';
export const BoardContext = React.createContext();

function BoardPage() {
    const { game_id: gameIdFromParams } = useParams(); 
    const navigate = useNavigate();
    const usernameRef = useRef(null); 
    const moveplayed = useRef(null);
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
    const [serverTime, setServerTime] = useState(Date.now());
    const [turnStartTime, setTurnStartTime] = useState(null); 
    const wsManagerRef = useRef(null); 
    const {
        redTimeRemaining,
        setRedTimeRemaining,
        blackTimeRemaining,
        setBlackTimeRemaining,
        setIsRedTimerRunning,
        setIsBlackTimerRunning
    } = useGameTimer(600, 600);

    const webSocketProps = {
        setRedTimeRemaining,
        setBlackTimeRemaining,
        setServerTime,
        setIsRedTimerRunning,
        setIsBlackTimerRunning,
        setTurnStartTime,
        handleFlipBoard, 
        handleParseFENInput, 
        setCurrentTurn,
        setError, 
        usernameRef,
        latestCurrentTurn, 
    };


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
            } 
            catch (error) {
                console.error('Error fetching user details:', error);
                setError(true);
            }
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
                    setCurrentTurn(gameData.turn)
                    gameIdRef.current = gameIdFromParams;  
                    if (usernameRef.current === gameData.black_player) {
                        handleFlipBoard(); 
                    }
                   
                        setRedTimeRemaining(gameData.red_time_remaining);
                        setBlackTimeRemaining(gameData.black_time_remaining);
        
                        if (gameData.turn === 'red') {
                            setIsRedTimerRunning(true);
                            setIsBlackTimerRunning(false);
                            setTurnStartTime(Date.now());
                        } else {
                            setIsRedTimerRunning(false);
                            setIsBlackTimerRunning(true);
                            setTurnStartTime(Date.now());
                        }


                    
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
                   
                }
            } catch (error) {
                setError(true);
            }
        }
        useEffect(() => {
            initializeGame().then(() => {
                const token = localStorage.getItem('access_token');
                wsManagerRef.current = WebSocketManager.getInstance(
                    'ws://localhost:8000/ws/game/',
                    token,
                    ws => handleWebSocketOpen(ws, gameIdRef),
                    data => handleWebSocketMessage(data, webSocketProps),
                    () => console.log('WebSocket closed for BoardPage'),
                    (err) => console.error('WebSocket error for BoardPage:', err)
                );
                wsManagerRef.current.connect();  
            });
    
            return () => {
                if (wsManagerRef.current) {
                    wsManagerRef.current.closeConnection();
                }
            };
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
        newSqr.forEach((s) => (s.isSelected = false));
        if (index !== -1) {
            newSqr[index].isSelected = true;
            setSelectedSquareInfo((prevState) => ({ ...prevState, ...newSqr[index] }));
    
            setCounter(1);
            setSqr(newSqr);
        }
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
            setGameOver,
            setCounter,
            setSelectedSquareInfo,
            moveplayed
        );

        handleGenerateFEN();

        if ( move && wsManagerRef.current && wsManagerRef.current.isConnected) {
           
            const thinkingTime = Math.floor((Date.now() - turnStartTime) / 1000); 

            const message = JSON.stringify({
                type: 'game.move',
                fen: latestFENOutput.current,
                player: latestCurrentTurn.current,
                move: moveplayed.current,
                thinking_time: thinkingTime 
            });
            wsManagerRef.current.sendMessage(message);

            if (currentTurn === 'red') {
                setIsRedTimerRunning(false);
                setIsBlackTimerRunning(true);
            } else {
                setIsBlackTimerRunning(false);
                setIsRedTimerRunning(true);
            }
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
        generateFEN(setFENOutput, latestSqr.current, isFlipped, latestCurrentTurn.current);
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
                        <div className="timer-container">
                            <div className="timer-red">
                                <p>Red Player: {Math.floor(redTimeRemaining / 60)}:{redTimeRemaining % 60 < 10 ? `0${redTimeRemaining % 60}` : redTimeRemaining % 60}</p>
                            </div>
                            <div className="timer-black">
                                <p>Black Player: {Math.floor(blackTimeRemaining / 60)}:{blackTimeRemaining % 60 < 10 ? `0${blackTimeRemaining % 60}` : blackTimeRemaining % 60}</p>
                            </div> 
                        </div>
                        <Board squares={sqr} />
                    </div>
                </div>
            </BoardContext.Provider>
        </DndProvider>
    );
}

export default BoardPage;
