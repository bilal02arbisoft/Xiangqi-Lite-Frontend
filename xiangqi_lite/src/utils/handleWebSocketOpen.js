export const handleWebSocketOpen = (ws, gameIdRef) => {
    
    if (ws && ws.readyState === WebSocket.OPEN && gameIdRef.current) {
        ws.send(JSON.stringify({
            type: 'game.join',
            id: gameIdRef.current,
        }));
        ws.send(JSON.stringify({
            type: 'game.get',
            id: gameIdRef.current,
        }));

    } else {
        
        console.log('WebSocket state:', ws ? ws.readyState : 'ws is null');

    }
};