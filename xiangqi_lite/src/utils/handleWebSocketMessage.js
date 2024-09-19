export const handleWebSocketMessage = (data, props) => {
    const {
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
        handleGameEnd,
        gameover,
        setRedMoveTimeRemaining,
        setBlackMoveTimeRemaining,
        setIsRedMoveTimerRunning,
        setIsBlackMoveTimerRunning 
        
    } = props;

    switch (data.type) {
        case 'game.start':
            
            if ( usernameRef.current === data.black_player) {
                handleFlipBoard();
            }
            setIsGameReady(true);
            setShowCountdown(true); 
            setIsCountdownActive(true);
            break;
        case 'game.move':
            if (data.fen && data.player !== latestCurrentTurn.current) {
                handleParseFENInput(data.fen);
                setCurrentTurn(data.player);
                updateMoveHistory(
                    data.player,
                    data.move,
                    data.fen,
                    data.thinking_time, 
                    data.red_time_remaining,
                    data.black_time_remaining
                );
             
                setRedTimeRemaining(data.red_time_remaining);
                setBlackTimeRemaining(data.black_time_remaining);
               
                setRedMoveTimeRemaining(60);
                setBlackMoveTimeRemaining(60);
                setServerTime(data.server_time * 1000);
                setTurnStartTime(Date.now());
                if (data.player === 'red') {
                    setIsRedTimerRunning(true);
                    setIsBlackTimerRunning(false);
                    setIsRedMoveTimerRunning(true);
                    setIsBlackMoveTimerRunning(false);
                   
                } else {
                    setIsRedTimerRunning(false);
                    setIsBlackTimerRunning(true);
                    setIsRedMoveTimerRunning(false);
                    setIsBlackMoveTimerRunning(true);

                }
                gameover();
            }
            break;

        case 'game.get.success':
            handleGameGetSuccess(data.data)
            break;

        case 'game.chat':
            data.isSent = 'received'
            const utcDate = new Date(data.timestamp);
            const localDateString = utcDate.toLocaleString(); 
            data.timestamp = localDateString;
            console.log("data to update",data)
            
            updateChatMessages(data);
            break;
        case 'game.users.list':
            handleUserListData(data.data)
            addUser(data.data)

            break;
        
        case 'game.viewer.joined':
            setViewers((prevViewers) => [...prevViewers, data.data]);
            console.log("My username",usernameRef.current)
            console.log("Revied username",data.data.username)
            addUser(data.data)
            setShowOverlay(false)
            if ( usernameRef.current === data.data.username) {
                setIsGameReady(true);
                setGamePlayer(false) ;
                if (latestCurrentTurn.current === 'red') {
                    setIsRedTimerRunning(true);
                    setIsBlackTimerRunning(false);
                    setIsBlackMoveTimerRunning(false);
                    setIsRedMoveTimerRunning(true);
                    
                } else {
                    setIsRedTimerRunning(false);
                    setIsBlackTimerRunning(true);
                    setIsBlackMoveTimerRunning(true);
                    setIsRedMoveTimerRunning(false);
                }  
            }
           
            break;
        case 'game.end.success':
            handleGameEnd(data.message)
            break;

        case 'error':
            setError(true);
            console.error("Error received:", data.message);
            break;
        default:
            console.error("Received unknown data type:", data.type);
    }
};
