import { useState, useEffect, useRef } from 'react';

export const useMoveTimer = (
    initialRedMoveTime, 
    initialBlackMoveTime, 
    handleTimerExpire, 
    isPlayerAllowedToMove
) => {
    const [redMoveTimeRemaining, setRedMoveTimeRemaining] = useState(initialRedMoveTime); 
    const [blackMoveTimeRemaining, setBlackMoveTimeRemaining] = useState(initialBlackMoveTime);
    const [isRedMoveTimerRunning, setIsRedMoveTimerRunning] = useState(false); 
    const [isBlackMoveTimerRunning, setIsBlackMoveTimerRunning] = useState(false);

    const redMoveIntervalID = useRef(null);
    const blackMoveIntervalID = useRef(null);

    const startMoveTimer = (isRed) => {
        let prevTime = Date.now();
        const intervalID = isRed ? redMoveIntervalID : blackMoveIntervalID;

        intervalID.current = setInterval(() => {
            const setMoveTimeRemaining = isRed ? setRedMoveTimeRemaining : setBlackMoveTimeRemaining;

            setMoveTimeRemaining((time) => {
                const newTime = time * 1000 - (Date.now() - prevTime);
                prevTime = Date.now();

                const remainingSeconds = Math.round(newTime / 1000);
                if (remainingSeconds <= 0) {
                    clearInterval(intervalID.current);
                    if (isPlayerAllowedToMove()) {
                        handleTimerExpire();
                    }
                    return 0;
                }

                return remainingSeconds;
            });
        }, 1000);
    };

    const stopMoveTimer = (isRed) => {
        const intervalID = isRed ? redMoveIntervalID : blackMoveIntervalID;
        clearInterval(intervalID.current);
    };

    useEffect(() => {
        if (isRedMoveTimerRunning) {
            startMoveTimer(true); // Start red move timer
        } else {
            stopMoveTimer(true); // Stop red move timer
        }

        if (isBlackMoveTimerRunning) {
            startMoveTimer(false); // Start black move timer
        } else {
            stopMoveTimer(false); // Stop black move timer
        }

        return () => {
            stopMoveTimer(true);
            stopMoveTimer(false);
        };
    }, [isRedMoveTimerRunning, isBlackMoveTimerRunning, isPlayerAllowedToMove]);

    return {
        redMoveTimeRemaining,
        setRedMoveTimeRemaining, 
        blackMoveTimeRemaining, 
        setBlackMoveTimeRemaining, 
        setIsRedMoveTimerRunning, 
        setIsBlackMoveTimerRunning
    };
};
