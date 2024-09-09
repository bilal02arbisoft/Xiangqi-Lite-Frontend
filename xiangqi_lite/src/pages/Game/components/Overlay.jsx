import React, { useState } from 'react';

import 'css/overlay.css';

import PlayerCard from 'pages/Game/components/PlayerCard'; 

function OverlayComponent({ gameId, isVisible, onClose, countdown, showCountdown, type, gameResult, redPlayer, blackPlayer }) {
    const gameLink = `http://localhost:3000/game/${gameId}`;
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopyClick = () => {
        navigator.clipboard.writeText(gameLink).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return isVisible ? (
        <div className="overlay-component">
            <div className={`modal ${type === 'end' ? 'modal-large' : ''}`}>
                
                <button className="close-button" onClick={onClose}>×</button>

               
                {type === 'start' && showCountdown ? (
                    <div>
                        <h2>Game starting in: {countdown}</h2>
                    </div>
                ) : type === 'start' ? (
                    <div>
                        <h2>Waiting For Opponent...</h2>
                        <button onClick={handleCopyClick}>Copy Invite Link</button>
                        {copySuccess && <span style={{ color: 'green', marginLeft: '10px' }}>{copySuccess}</span>}
                    </div>
                ) : type === 'end' ? (
                    <div>
                        <h2 style={{color:'red', marginLeft:'30px', fontSize:'20px'}}>Game Over</h2>
                        <div className="player-results">
                            <div className="player-card-container">
                                <PlayerCard player={redPlayer.username === gameResult.winner ? redPlayer : blackPlayer} />
                                <h4 style={{color:'green', marginRight:'50px'}}> Winner</h4>
                            </div>
                            <h3 style={{ color: 'black'}}> VS</h3>
                            <div className="player-card-container">
                                <PlayerCard player={redPlayer.username === gameResult.loser ? redPlayer : blackPlayer} />
                                <h4 style={{color:'red', marginRight:'70px'}}>Loser</h4>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    ) : null;
}

export default OverlayComponent;
