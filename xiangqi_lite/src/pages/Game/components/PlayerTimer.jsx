import React from 'react';
import PlayerCard from 'pages/Game/components/PlayerCard';

function PlayerTimer({ isFlipped, blackTimeRemaining, redTimeRemaining, redPlayer, blackPlayer }) {
    // Function to format time
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    // Determine the color based on the flipped state
    const timerColor = isFlipped ? 'red' : 'black';

    return (
        <div className="player-timer-row">
            <div className={`timer-container ${!isFlipped ? 'timer-container-top' : 'timer-container-bottom'}`}>
                <div className="timer">
                    <p style={{ color: timerColor }}>
                        {!isFlipped
                            ? formatTime(blackTimeRemaining)
                            : formatTime(redTimeRemaining)}
                    </p>
                    <p style={{ color: timerColor }}>Game</p>
                </div>
            </div>
            <PlayerCard player={isFlipped ? redPlayer : blackPlayer} color={isFlipped ? 'red' : 'black'} />
        </div>
    );
}

export default PlayerTimer;
