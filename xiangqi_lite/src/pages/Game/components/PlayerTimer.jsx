import React from 'react';
import PlayerCard from 'pages/Game/components/PlayerCard';

function PlayerTimer({ isFlipped, blackTimeRemaining, redTimeRemaining, redPlayer, blackPlayer }) {
    
    return (
        <div className={`player-timer-row`}>
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
    );
}

export default PlayerTimer;
