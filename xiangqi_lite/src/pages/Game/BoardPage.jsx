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
import { useGameTimer } from 'pages/Game/components/Timer';
import MoveHistory from "pages/Game/components/MoveHistory";
import { handleWebSocketOpen, handleWebSocketMessage } from 'pages/Game/components/WebsocketHandler'; 
import WebSocketManager from  'utils/useWebSocket';
import GameTabs from 'pages/Game/components/GameTab';
import PlayerCard from "pages/Game/components/PlayerCard";
import OverlayComponent from 'pages/Game/components/Overlay';
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
    const [moveHistory, setMoveHistory,latestMoveHisotry] = useState([]); 
    const [fenHistory, setFenHistory] = useState([]); 
    const [chatMessages, setChatMessages] = useState([]);
    const [redPlayer, setRedPlayer] = useState(null);
    const [blackPlayer, setBlackPlayer] = useState(null);
    const [isGameReady, setIsGameReady] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true); 
    const [countdown, setCountdown] = useState(5);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);



    const updateChatMessages = (chatMessage) => {
        setChatMessages(prevMessages => [...prevMessages, chatMessage]);
    };
    const handleClose = () => {
        setShowOverlay(false);
    };
    const handleGameGetSuccess = (gameData) => {
        setFENOutput(gameData.fen);
        handleParseFENInput(gameData.fen);
        setCurrentTurn(gameData.turn);
        gameIdRef.current = gameData.game_id;  
    
        if (usernameRef.current === gameData.black_player) {
            handleFlipBoard(); 
        }
    
        setRedTimeRemaining(gameData.red_time_remaining);
        setBlackTimeRemaining(gameData.black_time_remaining);
       
    };
    const handleUserListData = (userData) => {
        if (userData.length > 0) {
            setRedPlayer(userData[0]);
            setBlackPlayer(userData[1]);
        }
    };
    
    
    const {
        redTimeRemaining,
        setRedTimeRemaining,
        blackTimeRemaining,
        setBlackTimeRemaining,
        setIsRedTimerRunning,
        setIsBlackTimerRunning
    } = useGameTimer(600, 600);

    function updateMoveHistory(player, move) {
        setMoveHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            console.log("move which i'm updating",move)
            
                newHistory.push(move); 
            
            return newHistory;
        });
    }

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
        updateMoveHistory,
        moveHistory,
       updateChatMessages,
       handleGameGetSuccess,
       handleUserListData,
       setIsGameReady,
       setShowOverlay,
       setShowCountdown,
       setIsCountdownActive
    
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
                if (!gameIdFromParams) {
                    
                    const response = await axios.post('http://127.0.0.1:8000/game/create/', null, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const gameData = response.data;
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

        useEffect(() => {
            let timerId;
    
            if (isCountdownActive && countdown > 0) {
                timerId = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
            } else if (countdown === 0) {
                setIsCountdownActive(false); // Stop the countdown
                setShowOverlay(false); // Hide the overlay completely
                if (latestCurrentTurn.current === 'red') {
                    setIsRedTimerRunning(true);
                    setIsBlackTimerRunning(false);
        
                    
                } else {
                    setIsRedTimerRunning(false);
                    setIsBlackTimerRunning(true);
                    
                }
            }
    
            return () => clearTimeout(timerId);
        }, [countdown, isCountdownActive]);
       

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
            updateMoveHistory(currentTurn, moveplayed.current);
        
        }
    }
    function handleUndo() {
        if (moveHistory.length > 0 && fenHistory.length > 1) { 
            const newMoveHistory = moveHistory.slice(0, -1);
            const newFenHistory = fenHistory.slice(0, -1); 
    
            setMoveHistory(newMoveHistory);
            setFenHistory(newFenHistory);
    
            const previousFEN = newFenHistory[newFenHistory.length - 1];
            handleParseFENInput(previousFEN); 
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
                    moveHistory,
                    wsManagerRef,
                    updateChatMessages,
                    chatMessages,
                    setChatMessages
                }}
            >
                <div className="app__container">
                
                <div className={`board-container ${showOverlay ? 'blurred' : ''}`}>
                <OverlayComponent
                gameId={gameIdRef.current}
                isVisible={showOverlay}
                onClose={() => setShowOverlay(false)}
                countdown={countdown}
                showCountdown={showCountdown}
            />
        <Board squares={sqr} />
    </div>

    <div className="side-container">
        <div className={`player-timer-row ${!isFlipped ? 'row-top' : 'row-bottom'}`}>
            
            <div className={`timer-container ${!isFlipped ? 'timer-container-top' : 'timer-container-bottom'}`}>
                <div className={!isFlipped ? 'timer-black' : 'timer-red'}>
                    <p>
                        {!isFlipped
                            ? `Game Time : ${Math.floor(blackTimeRemaining / 60)}:${blackTimeRemaining % 60 < 10 ? `0${blackTimeRemaining % 60}` : blackTimeRemaining % 60}`
                            : `Game Time : ${Math.floor(redTimeRemaining / 60)}:${redTimeRemaining % 60 < 10 ? `0${redTimeRemaining % 60}` : redTimeRemaining % 60}`}
                    </p>
                </div>
            </div>
            <PlayerCard player={isFlipped ? redPlayer : blackPlayer} color={isFlipped ? 'red' : 'black'} />
        </div>
        
        
        <div className="combined-section">
            <div className="tabs-container">
                <GameTabs />
            </div>

           
            <div className={`player-timer-row ${!isFlipped ? 'row-bottom' : 'row-top'}`}>
                
                <div className={`timer-container ${!isFlipped ? 'timer-container-bottom' : 'timer-container-top'}`}>
                    <div className={!isFlipped ? 'timer-red' : 'timer-black'}>
                        <p>
                            {!isFlipped
                                ? `Game Time: ${Math.floor(redTimeRemaining / 60)}:${redTimeRemaining % 60 < 10 ? `0${redTimeRemaining % 60}` : redTimeRemaining % 60}`
                                : `Game Time: ${Math.floor(blackTimeRemaining / 60)}:${blackTimeRemaining % 60 < 10 ? `0${blackTimeRemaining % 60}` : blackTimeRemaining % 60}`}
                        </p>
                    </div>
                </div>
                <PlayerCard player={isFlipped ? blackPlayer : redPlayer} color={isFlipped ? 'black' : 'red'} />
            </div>
        </div>
        
    </div>
</div>
            </BoardContext.Provider>
        </DndProvider>
    );
}

export default BoardPage;