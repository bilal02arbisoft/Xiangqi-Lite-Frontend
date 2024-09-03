import React, { useState,useContext} from 'react';
import MoveHistory from 'pages/Game/components/MoveHistory';
import { BoardContext }  from "pages/Game/BoardPage";
import Chat from './Chat';
import Viewers from 'pages/Game/components/Viewers';





function TabPanel({ children }) {
    return <div className="tab-content">{children}</div>;
}

 export default function GameTabs() {
    const {moveHistory} = useContext(BoardContext);
    const {viewers} = useContext(BoardContext);
    const [activeTab, setActiveTab] = useState('chat');

    return (
        <div className='tabs-container'>
            <div className="tab-menu">
                <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
                    <h3>Chat</h3>
                    <img src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/chat-icon.svg" className="to-white" alt="chat icon"></img>
                </button>
                <button onClick={() => setActiveTab('moves')} className={activeTab === 'moves' ? 'active' : ''}>
                    <h3>Moves</h3>
                    <img src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/game-icon-red.svg" alt="moves icon"></img>
                </button>
                <button onClick={() => setActiveTab('viewers')} className={activeTab === 'viewers' ? 'active' : ''}>
                    <h3>Viewers</h3>
                    <img src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/viewers-icon-red.svg" className="to-white" alt="viewers icon"></img>
                </button>
            </div>
            <TabPanel>
                {activeTab === 'chat' && <Chat />}
                {activeTab === 'moves' && <MoveHistory moveHistory={moveHistory} />}
                {activeTab === 'viewers' && <Viewers viewers={viewers} />}
            </TabPanel>
        </div>
    );
}


