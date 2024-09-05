import React from 'react';
import 'css/overlay.css'; // Ensure you have the right CSS file imported

function ConfirmationModal({ isVisible, onConfirm, onCancel }) {
  if (!isVisible) return null; // If not visible, do not render the modal

  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <p>Are you sure you want to abandon the game?</p>
        <div className="confirmation-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="cancel-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
