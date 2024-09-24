import React from 'react';

import PlayerCard from 'components/PlayerCard'; 

const Viewers = (props) => {
  const { viewers } = props;
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
