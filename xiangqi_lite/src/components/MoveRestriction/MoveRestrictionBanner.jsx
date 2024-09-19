import React, { useEffect, useState } from 'react';
import './MoveRestrictionBanner.css'; 

const MoveRestrictionBanner = ({ duration = 10, onHide }) => { // Set default duration to 10 seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progressWidth, setProgressWidth] = useState(100); 

  useEffect(() => {
    if (timeLeft <= 0) {
      onHide();
      return;
    }

    // Start the countdown and progress bar immediately upon mount
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      setProgressWidth(prev => prev - (100 / duration));
    }, 1000);

    return () => clearInterval(timer); // Clean up on unmount
  }, [timeLeft, duration, onHide]);

  return (
    <div className="move-restriction-banner" role="alert" aria-live="assertive">
      <div className="countdown">
        You cannot make a move while viewing the history. Returning to the latest move .
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MoveRestrictionBanner;
