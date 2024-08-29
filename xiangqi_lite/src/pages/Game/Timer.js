import { useState, useEffect } from 'react';

export const useGameTimer = (initialRedTime, initialBlackTime) => {
    const [redTimeRemaining, setRedTimeRemaining] = useState(initialRedTime); 
    const [blackTimeRemaining, setBlackTimeRemaining] = useState(initialBlackTime); 
    const [isRedTimerRunning, setIsRedTimerRunning] = useState(false);
    const [isBlackTimerRunning, setIsBlackTimerRunning] = useState(false);

    useEffect(() => {
        let redTimerInterval = null;
        let blackTimerInterval = null;

        if (isRedTimerRunning) {
            redTimerInterval = setInterval(() => {
                setRedTimeRemaining((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(redTimerInterval);
                        setIsRedTimerRunning(false);
                        return 0;
                    }
                });
            }, 1000);
        } else if (isBlackTimerRunning) {
            blackTimerInterval = setInterval(() => {
                setBlackTimeRemaining((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(blackTimerInterval);
                        setIsBlackTimerRunning(false);
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => {
            clearInterval(redTimerInterval);
            clearInterval(blackTimerInterval);
        };
    }, [isRedTimerRunning, isBlackTimerRunning]);

    return {
        redTimeRemaining,
        setRedTimeRemaining,
        blackTimeRemaining,
        setBlackTimeRemaining,
        setIsRedTimerRunning,
        setIsBlackTimerRunning
    };
};
