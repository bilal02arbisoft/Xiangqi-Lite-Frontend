import React from 'react';

const PlayerCard = ({ player, color }) => {
  if (!player) return null; 

  return (
    <div className={`player-card player-${color}`}>
      <div className="player-info-row"> 
      <h3 className={color === 'red' ? 'red-text' : 'black-text'}>
          {player.username} ({player.rating})
        </h3>
        <img 
          src={player.profile_picture ? `http://127.0.0.1:8000${player.profile_picture}` : 'default_profile.png'} 
          alt={`${player.username}'s profile`} 
          className="profile-picture"
        />
        
      </div>
    </div>
  );
};

export default PlayerCard;
