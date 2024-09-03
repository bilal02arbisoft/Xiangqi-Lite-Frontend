import React from 'react';
import PlayerCard from 'pages/Game/components/PlayerCard'; 

const Viewers = ({ viewers }) => {
  return (
    <div className="viewers-tab">
      <div className="viewer-list">
        {viewers.map((viewer, index) => (
          <PlayerCard key={index} player={viewer} />
        ))}
      </div>
    </div>
  );
};

export default Viewers;
