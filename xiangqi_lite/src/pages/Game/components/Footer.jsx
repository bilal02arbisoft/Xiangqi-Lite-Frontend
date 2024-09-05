import React, { useState } from 'react'; 
import ConfirmationModal from 'pages/Game/components/Confirmation'; // Make sure the import path is correct

function FooterComponent({ onResign }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleResignClick = () => {
    setShowConfirmation(true); // Show confirmation modal
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onResign(); // Trigger the resign logic
  };

  const handleCancel = () => {
    setShowConfirmation(false); // Hide confirmation modal
  };

  return (
    <div className="footer-component">
      <button className="resign-button" onClick={handleResignClick}>
        <img 
          src="https://d2g1zxtf4l76di.cloudfront.net/images/abandon-red.svg" 
          className="footer-img to-white" 
          alt="abandoned-icon" 
        />
        Resign
      </button>
      
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isVisible={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default FooterComponent;
