export const handleWebSocketOpen = (ws, gameIdRef) => {
    if (ws.readyState === WebSocket.OPEN && gameIdRef.current) {
        ws.send(JSON.stringify({
            type: 'game.join',
            id: gameIdRef.current,
        }));
    }
};

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
        moveHistory
    } = props;

    switch (data.type) {
        case 'game.start':
            setRedTimeRemaining(data.red_time_remaining);
            setBlackTimeRemaining(data.black_time_remaining);
            setServerTime(data.server_time * 1000);

            setIsRedTimerRunning(true);
            setIsBlackTimerRunning(false);
            setTurnStartTime(Date.now());

            if ( usernameRef.current === data.black_player) {
                handleFlipBoard();
            }
            break;
        case 'game.move':
            if (data.fen && data.player !== latestCurrentTurn.current) {
                handleParseFENInput(data.fen);
                setCurrentTurn(data.player);
                setRedTimeRemaining(data.red_time_remaining);
                setBlackTimeRemaining(data.black_time_remaining);
                setServerTime(data.server_time * 1000);
                updateMoveHistory(data.player, data.move);
                console.log("Move history",moveHistory)
                


                if (data.player === 'red') {
                    setIsRedTimerRunning(true);
                    setIsBlackTimerRunning(false);
                    setTurnStartTime(Date.now());
                } else {
                    setIsRedTimerRunning(false);
                    setIsBlackTimerRunning(true);
                    setTurnStartTime(Date.now());
                }
            }
            break;
        case 'error':
            setError(true);
            console.error("Error received:", data.message);
            break;
        default:
            console.error("Received unknown data type:", data.type);
    }
};
