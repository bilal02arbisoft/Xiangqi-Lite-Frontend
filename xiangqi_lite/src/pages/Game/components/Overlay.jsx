import React, { useState } from 'react';
import 'css/overlay.css'; 

function OverlayComponent({ gameId, isVisible, onClose, countdown, showCountdown }) {
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
                {showCountdown ? (
                    <div>
                        <h2>Game starting in: {countdown}</h2>
                    </div>
                ) : (
                    <div>
                        <h2>Waiting For Opponent...</h2>
                        <button onClick={handleCopyClick}>Copy Invite Link</button>
                        {copySuccess && <span style={{ color: 'green', marginLeft: '10px' }}>{copySuccess}</span>}
                    </div>
                )}
                
            </div>
        </div>
    ) : null;
}


export default OverlayComponent;
