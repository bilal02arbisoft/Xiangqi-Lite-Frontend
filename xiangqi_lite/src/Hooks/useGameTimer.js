import { useState, useEffect, useRef } from 'react';

export const useGameTimer = (props) => {
    const {
        initialRedTime,
        initialBlackTime,
        onTimerExpire,
        isPlayerAllowedToMove,
    } = props;
    
    const [redTimeRemaining, setRedTimeRemaining] = useState(initialRedTime);
    const [blackTimeRemaining, setBlackTimeRemaining] = useState(initialBlackTime);
    const [isRedTimerRunning, setIsRedTimerRunning] = useState(false);
    const [isBlackTimerRunning, setIsBlackTimerRunning] = useState(false);

    const redIntervalID = useRef(null);
    const blackIntervalID = useRef(null);

    const startTimer = (isRed) => {
        let prevTime = Date.now();
        const intervalID = isRed ? redIntervalID : blackIntervalID;
        
        intervalID.current = setInterval(() => {
            const setRemainingTime = isRed ? setRedTimeRemaining : setBlackTimeRemaining;
            setRemainingTime((time) => {
                const newTime = time * 1000 - (Date.now() - prevTime);
                prevTime = Date.now();

                const remainingSeconds = Math.round(newTime / 1000);
                if (remainingSeconds <= 0) {
                    clearInterval(intervalID.current);
                    if (onTimerExpire && isPlayerAllowedToMove()) {
                        onTimerExpire();
                    }
                    return 0;
                }

                return remainingSeconds;
            });
        }, 1000);
    };

    const stopTimer = (isRed) => {
        const intervalID = isRed ? redIntervalID : blackIntervalID;
        clearInterval(intervalID.current);
    };

    useEffect(() => {
        if (isRedTimerRunning) {
            startTimer(true); // Start red timer
        } else {
            stopTimer(true); // Stop red timer
        }

        if (isBlackTimerRunning) {
            startTimer(false); // Start black timer
        } else {
            stopTimer(false); // Stop black timer
        }

        return () => {
            stopTimer(true);
            stopTimer(false);
        };
    }, [isRedTimerRunning, isBlackTimerRunning, onTimerExpire, isPlayerAllowedToMove]);

    return {
        redTimeRemaining,
        setRedTimeRemaining,
        blackTimeRemaining,
        setBlackTimeRemaining,
        setIsRedTimerRunning,
        setIsBlackTimerRunning,
    };
};
