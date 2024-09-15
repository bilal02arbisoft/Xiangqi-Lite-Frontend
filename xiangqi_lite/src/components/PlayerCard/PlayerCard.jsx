import React from 'react';

const PlayerCard = (props) => {
  const { player} = props;
  if (!player) return null; 

  return (
    <div className={`player-card`}>
      <div className="player-info-row"> 
      <h3 >
          {player.username}
          {player.rating && ` (${player.rating})`}
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
