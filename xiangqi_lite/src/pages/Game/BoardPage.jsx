import React, { useEffect, useRef, useCallback } from 'react';
import useState from 'react-usestateref';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';

import './boardpage.css';

import { generateFEN, parseFENInput } from 'utils/FENUtils';
import WebSocketManager from 'utils/WebSocket';
import { initializeSquares, findAvailableSqr, MovePiece } from 'utils/GameLogic';
import { handleWebSocketOpen} from 'utils/handleWebSocketOpen';
import  {handleWebSocketMessage } from 'utils/handleWebSocketMessage';

import Board from 'components/Board';
import GameTabs from 'components/GameTabs';
import OverlayComponent from 'components/Overlay';
import FooterComponent from 'components/Footer';
import PlayerTimer from 'components/PlayerTimer';

import { useGameTimer } from 'Hooks/useGameTimer';

export const BoardContext = React.createContext();

const BoardPage = () => {
    const { game_id: gameIdFromParams } = useParams(); 
    const navigate = useNavigate();

    const usernameRef = useRef(null); 
    const moveplayed = useRef(null);
    const gameIdRef = useRef(gameIdFromParams); 
    const [sqr, setSqr, latestSqr] = useState(initializeSquares);
    const [isFlipped, setIsFlipped, latestIsFlipped] = useState(false);
    const [selectedSquareInfo, setSelectedSquareInfo, latestSelectedSquareInfo] = useState();
    const [, setAvailableSqr, latestAvailableSqr] = useState([]);
    const [, setCounter, latestCounter] = useState(0);
    const [currentTurn, setCurrentTurn, latestCurrentTurn] = useState("red");
    const [, setCapturedPieceList, latestCapturedPieceList] = useState([]);
    const [FENOutput, setFENOutput, latestFENOutput] = useState("");
    const [, setError] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [, setHalfMoveClock] = useState(0);
    const [, setFullMoveNumber] = useState(1);
    const [, setSqrHistory] = useState([initializeSquares()]);
    const [, setServerTime] = useState(Date.now());
    const [, setTurnStartTime, latestTurnStartTime] = useState(null); 
    const wsManagerRef = useRef(null); 
    const [moveHistory, setMoveHistory] = useState([]); 
    const [fenHistory, setFenHistory] = useState([]); 
    const [chatMessages, setChatMessages] = useState([]);
    const [redPlayer, setRedPlayer,latestRed] = useState(null);
    const [blackPlayer, setBlackPlayer,latestBlack] = useState(null);
    const [isGameReady, setIsGameReady] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true); 
    const [countdown, setCountdown] = useState(5);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [viewers, setViewers] = useState([]);
    const [gameplayer,setGamePlayer] = useState(true);
    const [users, setUsers] = useState({});
    const useridRef  = useRef(null);
    const [showWarning, setShowWarning] = useState(false); 
    const [warningCountdown, setWarningCountdown] = useState(60); 
    const [isWarningActive, setIsWarningActive] = useState(false); 
    const [overlayType, setOverlayType] = useState('start'); 
    const [gameResult, setGameResult] = useState(''); 

    const isPlayerAllowedToMove = useCallback(() => {
        return gameplayer &&  isGameReady && ((currentTurn === "red" && !isFlipped) || (currentTurn === "black" && isFlipped));
    }, [gameplayer, currentTurn, isFlipped, isGameReady]);

    const addUser = (newUsers) => {
        setUsers(prevUsers => {
          const usersData = { ...prevUsers }; 
          if (Array.isArray(newUsers)) {
            newUsers.forEach((user) => {
              usersData[user.id] = user; 
            });
          } else if (newUsers.id) {
            usersData[newUsers.id] = newUsers; 
          }
          return usersData; 
        });
      };
    
    const handleTimerExpire = () => {
        console.log(`${usernameRef.current} timer expired!`);

       
        if (isPlayerAllowedToMove()) {
            console.log("Sending game.end event to the backend");

            
            if (wsManagerRef.current && wsManagerRef.current.isConnected) {
                const message = JSON.stringify({
                    type: 'game.end',
                    game_id: gameIdRef.current,
                    losing_player:usernameRef.current,
                });
                wsManagerRef.current.sendMessage(message);
            }
        } else {
            console.log("Not allowed to send game.end event");
        }
    };

    const updateChatMessages = (chatMessage) => {
        setChatMessages(prevMessages => [...prevMessages, chatMessage]);
    };
    const handleGameGetSuccess = (gameData) => {
        setFENOutput(gameData.fen);
        handleParseFENInput(gameData.fen);
        setCurrentTurn(gameData.turn);
        console.log("Current turn on game start",latestCurrentTurn.current)
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
    } = useGameTimer(300, 300,handleTimerExpire,isPlayerAllowedToMove);

    function updateMoveHistory(player, move, fen) {
        setMoveHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory.push(move);
      
          return newHistory;
        });
      
        setFenHistory((prevFenHistory) => {
          const newFenHistory = [...prevFenHistory];
          newFenHistory.push(fen);
      
          return newFenHistory;
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
        setIsCountdownActive,
        setViewers,
        setGamePlayer,
        addUser,
        handleGameEnd
    
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
                useridRef.current = userData.id;
                console.log("This is id",useridRef.current)
                
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
                setIsCountdownActive(false); 
                setShowOverlay(false); 
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
           
    useEffect(() => {
        let warningTimerId;

        if (isWarningActive && warningCountdown > 0) {
            warningTimerId = setTimeout(() => {
                setWarningCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } else if (warningCountdown === 0) {
            setIsWarningActive(false);
            handleTimerExpire();
            setGameOver(true);
        }

        return () => clearTimeout(warningTimerId);
    }, [isWarningActive, warningCountdown]);

    useEffect(() => {
        let inactivityTimeout;

        
        if (isGameReady && isPlayerAllowedToMove() && !moveplayed.current) {
           
        
            inactivityTimeout = setTimeout(() => {
                setShowWarning(true); 
                setWarningCountdown(60);
                setIsWarningActive(true);

            }, 15000); 
        }

        return () => clearTimeout(inactivityTimeout); 
    }, [isPlayerAllowedToMove, isGameReady, moveplayed]);

    function handleGameEnd(result) {
        setGameOver(true);
        setGameResult(result);
        setOverlayType('end');
        setShowOverlay(true);
        setIsGameReady(false);
        setShowWarning(false);
        setIsRedTimerRunning(false);
        setIsBlackTimerRunning(false);
        const winner =result
        const loser = latestRed.current.username === winner ? latestBlack.current.username : latestRed.current.username;
        setGameResult({
            winner: winner,
            loser: loser,
        });
    }

       

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
    
    function handleMovePiece(piece, color, row, column) {
        

        if (!isPlayerAllowedToMove()) {
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
       
        

        if ( move && wsManagerRef.current && wsManagerRef.current.isConnected) {
            updateMoveHistory(currentTurn, moveplayed.current,latestFENOutput.current);
           
            const thinkingTime = Math.floor((Date.now() - latestTurnStartTime.current) / 1000); 
            console.log("Thinking time :",thinkingTime)
            console.log("Turn start time",latestTurnStartTime.current)
            handleGenerateFEN();

            const message = JSON.stringify({
                type: 'game.move',
                fen: latestFENOutput.current,
                player: latestCurrentTurn.current,
                move: moveplayed.current,
                thinking_time: thinkingTime 
            });
            wsManagerRef.current.sendMessage(message);

            if (latestCurrentTurn.current === 'red') {
                setIsRedTimerRunning(true);
                setIsBlackTimerRunning(false);
            } else {
                setIsBlackTimerRunning(true);
                setIsRedTimerRunning(false);
            }
           
            moveplayed.current = null;
            setShowWarning(false);
            setIsWarningActive(false);
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
                    setChatMessages,
                    latestIsFlipped,
                    viewers,
                    usernameRef,
                    users,
                    useridRef,
                    fenHistory,
                    isPlayerAllowedToMove
                    
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
                            type={overlayType}
                            gameResult={gameResult}
                            redPlayer={redPlayer}
                            blackPlayer={blackPlayer}
                        />
                        <div className="left-container">
      {showWarning && (
        <div className="warning-banner">
          <p>Game will be abandoned in {warningCountdown < 10 ? `0${warningCountdown}` : warningCountdown} s</p>
        </div>
      )}

      <Board squares={sqr} />
      
     
      <FooterComponent onResign={handleTimerExpire} /> 

    </div>
  </div>
                

        <div className="side-container">
          <PlayerTimer
            isFlipped={isFlipped}
            blackTimeRemaining={blackTimeRemaining}
            redTimeRemaining={redTimeRemaining}
            redPlayer={redPlayer}
            blackPlayer={blackPlayer}
            isTimerActive={latestCurrentTurn.current === "black"}
          />

          <div className="combined-section">
            <div className="tabs-container">
              <GameTabs />
            </div>

            <PlayerTimer
              isFlipped={!isFlipped}
              blackTimeRemaining={blackTimeRemaining}
              redTimeRemaining={redTimeRemaining}
              redPlayer={redPlayer}
              blackPlayer={blackPlayer}
              isTimerActive={latestCurrentTurn.current === "red"}
            />
          </div>
        </div>
      </div>
            </BoardContext.Provider>
        </DndProvider>
    );
}

export default BoardPage;