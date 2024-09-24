import React, { useState } from "react";

import ConfirmationModal from "components/Confirmation"; 

const FooterComponent = ({ onResign }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleResignClick = () => {
    setShowConfirmation(true); 
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onResign(); 
  };

  const handleCancel = () => {
    setShowConfirmation(false); 
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

      
      <ConfirmationModal
        isVisible={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default FooterComponent;
