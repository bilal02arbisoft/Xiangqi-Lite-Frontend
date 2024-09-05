import React, { useState } from 'react';
import 'css/overlay.css';

function OverlayComponent({ gameId, isVisible, onClose, countdown, showCountdown, type, gameResult }) {
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
            <div className="modal">
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
                        <h2>{gameResult}</h2>
                        
                    </div>
                ) : null}
            </div>
        </div>
    ) : null;
}

export default OverlayComponent;
